const twilio = require('twilio');
require('dotenv').config();

// Khởi tạo Twilio client
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const smsService = {
    /**
     * Gửi SMS xác nhận đặt lịch cho bệnh nhân
     */
    sendAppointmentConfirmation: async (appointment, patient, doctor, schedule) => {
        try {
            const message = await client.messages.create({
                body: `Phòng khám XYZ: Xác nhận đặt lịch khám thành công với BS. ${doctor.User.fullName} vào ngày ${new Date(schedule.date).toLocaleDateString('vi-VN')} lúc ${schedule.startTime}. Vui lòng đến trước 15 phút.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: `+84${patient.phoneNumber.substring(1)}` // Chuyển đổi từ 0xxx -> +84xxx
            });

            console.log(`SMS xác nhận đã được gửi đến ${patient.phoneNumber}, SID: ${message.sid}`);
        } catch (error) {
            console.error('Lỗi gửi SMS xác nhận:', error);
        }
    },

    /**
     * Gửi SMS nhắc lịch hẹn
     */
    sendAppointmentReminder: async (appointment, patient, doctor, schedule) => {
        try {
            const message = await client.messages.create({
                body: `Phòng khám XYZ: Nhắc nhở lịch khám với BS. ${doctor.User.fullName} vào ngày mai ${new Date(schedule.date).toLocaleDateString('vi-VN')} lúc ${schedule.startTime}. Vui lòng đến trước 15 phút.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: `+84${patient.phoneNumber.substring(1)}` // Chuyển đổi từ 0xxx -> +84xxx
            });

            console.log(`SMS nhắc nhở đã được gửi đến ${patient.phoneNumber}, SID: ${message.sid}`);
        } catch (error) {
            console.error('Lỗi gửi SMS nhắc nhở:', error);
        }
    },

    /**
     * Gửi SMS thông báo hủy lịch
     */
    sendCancellationNotification: async (appointment, patient, doctor, schedule) => {
        try {
            const message = await client.messages.create({
                body: `Phòng khám XYZ: Lịch khám với BS. ${doctor.User.fullName} vào ngày ${new Date(schedule.date).toLocaleDateString('vi-VN')} lúc ${schedule.startTime} đã bị hủy. Vui lòng liên hệ 0123456789 để biết thêm chi tiết.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: `+84${patient.phoneNumber.substring(1)}` // Chuyển đổi từ 0xxx -> +84xxx
            });

            console.log(`SMS hủy lịch đã được gửi đến ${patient.phoneNumber}, SID: ${message.sid}`);
        } catch (error) {
            console.error('Lỗi gửi SMS hủy lịch:', error);
        }
    }
};

module.exports = smsService;