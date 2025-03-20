const Appointment = require('../models/Appointment');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { Op } = require('sequelize');
const emailService = require('./emailService');
const smsService = require('./smsService');

/**
 * Dịch vụ gửi nhắc nhở lịch hẹn
 */
const reminderService = {
    /**
     * Gửi email và SMS nhắc nhở cho các lịch hẹn vào ngày mai
     */
    sendDailyReminders: async () => {
        try {
            // Lấy ngày mai
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowDate = tomorrow.toISOString().split('T')[0];

            console.log(`Đang gửi nhắc nhở cho các lịch hẹn vào ngày ${tomorrowDate}`);

            // Tìm tất cả lịch hẹn vào ngày mai có trạng thái confirmed hoặc pending
            const appointments = await Appointment.findAll({
                include: [{
                    model: Schedule,
                    where: {
                        date: tomorrowDate
                    }
                }],
                where: {
                    status: {
                        [Op.in]: ['confirmed', 'pending']
                    }
                }
            });

            console.log(`Tìm thấy ${appointments.length} lịch hẹn cần gửi nhắc nhở`);

            // Gửi nhắc nhở cho từng lịch hẹn
            for (const appointment of appointments) {
                const patient = await User.findByPk(appointment.patientId);
                const schedule = appointment.Schedule;
                const doctor = await Doctor.findByPk(schedule.doctorId, {
                    include: [{
                        model: User,
                        attributes: ['fullName', 'email', 'phoneNumber']
                    }]
                });

                // Gửi email nhắc nhở
                await emailService.sendAppointmentReminder(appointment, patient, doctor, schedule);

                // Gửi SMS nhắc nhở
                await smsService.sendAppointmentReminder(appointment, patient, doctor, schedule);

                console.log(`Đã gửi nhắc nhở cho lịch hẹn ID: ${appointment.id}`);
            }

            return appointments.length;
        } catch (error) {
            console.error('Lỗi gửi nhắc nhở lịch hẹn:', error);
            throw error;
        }
    }
};

module.exports = reminderService;