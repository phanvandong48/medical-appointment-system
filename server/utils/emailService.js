const transporter = require('../config/email');

const emailService = {
    /**
     * Gửi email xác nhận đặt lịch cho bệnh nhân
     */
    sendAppointmentConfirmation: async (appointment, patient, doctor, schedule) => {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: patient.email,
            subject: 'Xác nhận đặt lịch khám bệnh',
            html: `
                <h2>Xác nhận đặt lịch khám bệnh</h2>
                <p>Xin chào <strong>${patient.fullName}</strong>,</p>
                <p>Lịch khám của bạn đã được đặt thành công.</p>
                <h3>Thông tin chi tiết:</h3>
                <ul>
                    <li><strong>Bác sĩ:</strong> ${doctor.User.fullName}</li>
                    <li><strong>Chuyên khoa:</strong> ${doctor.specialization}</li>
                    <li><strong>Ngày khám:</strong> ${new Date(schedule.date).toLocaleDateString('vi-VN')}</li>
                    <li><strong>Thời gian:</strong> ${schedule.startTime} - ${schedule.endTime}</li>
                    <li><strong>Lý do khám:</strong> ${appointment.reason}</li>
                    <li><strong>Trạng thái:</strong> Chờ xác nhận</li>
                </ul>
                <p>Vui lòng đến trước 15 phút để hoàn thành thủ tục.</p>
                <p>Nếu bạn cần thay đổi hoặc hủy lịch, vui lòng đăng nhập vào hệ thống hoặc liên hệ với chúng tôi qua số điện thoại: <strong>0123456789</strong></p>
                <p>Trân trọng,<br>Phòng khám XYZ</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email xác nhận đã được gửi đến ${patient.email}`);
        } catch (error) {
            console.error('Lỗi gửi email xác nhận:', error);
        }
    },

    /**
     * Gửi email thông báo cho bác sĩ khi có lịch hẹn mới
     */
    sendDoctorNotification: async (appointment, patient, doctor, schedule) => {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: doctor.User.email,
            subject: 'Thông báo lịch hẹn mới',
            html: `
                <h2>Thông báo lịch hẹn mới</h2>
                <p>Xin chào Bác sĩ <strong>${doctor.User.fullName}</strong>,</p>
                <p>Bạn có một lịch hẹn mới.</p>
                <h3>Thông tin chi tiết:</h3>
                <ul>
                    <li><strong>Bệnh nhân:</strong> ${patient.fullName}</li>
                    <li><strong>Liên hệ:</strong> ${patient.email} - ${patient.phoneNumber}</li>
                    <li><strong>Ngày khám:</strong> ${new Date(schedule.date).toLocaleDateString('vi-VN')}</li>
                    <li><strong>Thời gian:</strong> ${schedule.startTime} - ${schedule.endTime}</li>
                    <li><strong>Lý do khám:</strong> ${appointment.reason}</li>
                </ul>
                <p>Vui lòng đăng nhập vào hệ thống để xác nhận hoặc quản lý lịch hẹn này.</p>
                <p>Trân trọng,<br>Hệ thống Phòng khám XYZ</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email thông báo đã được gửi đến bác sĩ ${doctor.User.email}`);
        } catch (error) {
            console.error('Lỗi gửi email thông báo cho bác sĩ:', error);
        }
    },

    /**
     * Gửi email thông báo khi lịch hẹn bị hủy
     */
    sendCancellationNotification: async (appointment, patient, doctor, schedule) => {
        // Email cho bệnh nhân
        const patientMailOptions = {
            from: process.env.EMAIL_USER,
            to: patient.email,
            subject: 'Thông báo hủy lịch khám',
            html: `
                <h2>Thông báo hủy lịch khám</h2>
                <p>Xin chào <strong>${patient.fullName}</strong>,</p>
                <p>Lịch khám sau đây đã được hủy:</p>
                <ul>
                    <li><strong>Bác sĩ:</strong> ${doctor.User.fullName}</li>
                    <li><strong>Ngày khám:</strong> ${new Date(schedule.date).toLocaleDateString('vi-VN')}</li>
                    <li><strong>Thời gian:</strong> ${schedule.startTime} - ${schedule.endTime}</li>
                </ul>
                <p>Nếu bạn muốn đặt lịch mới, vui lòng đăng nhập vào hệ thống hoặc liên hệ với chúng tôi.</p>
                <p>Trân trọng,<br>Phòng khám XYZ</p>
            `
        };

        // Email cho bác sĩ
        const doctorMailOptions = {
            from: process.env.EMAIL_USER,
            to: doctor.User.email,
            subject: 'Thông báo hủy lịch khám',
            html: `
                <h2>Thông báo hủy lịch khám</h2>
                <p>Xin chào Bác sĩ <strong>${doctor.User.fullName}</strong>,</p>
                <p>Lịch khám sau đây đã được hủy:</p>
                <ul>
                    <li><strong>Bệnh nhân:</strong> ${patient.fullName}</li>
                    <li><strong>Ngày khám:</strong> ${new Date(schedule.date).toLocaleDateString('vi-VN')}</li>
                    <li><strong>Thời gian:</strong> ${schedule.startTime} - ${schedule.endTime}</li>
                </ul>
                <p>Trân trọng,<br>Hệ thống Phòng khám XYZ</p>
            `
        };

        try {
            await transporter.sendMail(patientMailOptions);
            await transporter.sendMail(doctorMailOptions);
            console.log(`Email thông báo hủy lịch đã được gửi đến ${patient.email} và ${doctor.User.email}`);
        } catch (error) {
            console.error('Lỗi gửi email thông báo hủy lịch:', error);
        }
    },

    /**
     * Gửi email nhắc lịch hẹn
     */
    sendAppointmentReminder: async (appointment, patient, doctor, schedule) => {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: patient.email,
            subject: 'Nhắc nhở lịch khám',
            html: `
                <h2>Nhắc nhở lịch khám sắp đến</h2>
                <p>Xin chào <strong>${patient.fullName}</strong>,</p>
                <p>Chúng tôi xin nhắc nhở bạn về lịch khám sắp đến:</p>
                <ul>
                    <li><strong>Bác sĩ:</strong> ${doctor.User.fullName}</li>
                    <li><strong>Chuyên khoa:</strong> ${doctor.specialization}</li>
                    <li><strong>Ngày khám:</strong> ${new Date(schedule.date).toLocaleDateString('vi-VN')}</li>
                    <li><strong>Thời gian:</strong> ${schedule.startTime} - ${schedule.endTime}</li>
                </ul>
                <p>Vui lòng đến trước 15 phút để hoàn thành thủ tục.</p>
                <p>Nếu bạn cần thay đổi hoặc hủy lịch, vui lòng đăng nhập vào hệ thống hoặc liên hệ với chúng tôi qua số điện thoại: <strong>0123456789</strong></p>
                <p>Trân trọng,<br>Phòng khám XYZ</p>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email nhắc nhở đã được gửi đến ${patient.email}`);
        } catch (error) {
            console.error('Lỗi gửi email nhắc nhở:', error);
        }
    },
    sendCustomNotification: async (email, subject, htmlContent) => {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: htmlContent
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Email thông báo đã được gửi đến ${email}`);
        } catch (error) {
            console.error('Lỗi gửi email thông báo:', error);
            throw error;
        }
    }
};

module.exports = emailService;