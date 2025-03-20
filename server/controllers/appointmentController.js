const Appointment = require('../models/Appointment');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { Op } = require('sequelize');
const emailService = require('../utils/emailService');
const smsService = require('../utils/smsService');
const DoctorRating = require('../models/DoctorRating');

exports.createAppointment = async (req, res) => {
    try {
        const { scheduleId, reason } = req.body;
        const patientId = req.user.id;

        // Kiểm tra xem lịch có tồn tại và khả dụng không
        const schedule = await Schedule.findByPk(scheduleId);

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch khám'
            });
        }

        if (schedule.status !== 'available') {
            return res.status(400).json({
                success: false,
                message: 'Lịch khám này đã được đặt'
            });
        }

        // Tạo cuộc hẹn
        const appointment = await Appointment.create({
            patientId,
            scheduleId,
            reason,
            status: 'pending'
        });

        // Cập nhật trạng thái lịch
        await schedule.update({ status: 'booked' });

        // Lấy thông tin bệnh nhân
        const patient = await User.findByPk(patientId);

        // Lấy thông tin bác sĩ
        const doctor = await Doctor.findByPk(schedule.doctorId, {
            include: [{
                model: User,
                attributes: ['fullName', 'email', 'phoneNumber']
            }]
        });

        // Gửi email xác nhận đặt lịch
        await emailService.sendAppointmentConfirmation(appointment, patient, doctor, schedule);

        // Gửi SMS xác nhận đặt lịch
        await smsService.sendAppointmentConfirmation(appointment, patient, doctor, schedule);

        // Gửi email thông báo cho bác sĩ
        await emailService.sendDoctorNotification(appointment, patient, doctor, schedule);

        res.status(201).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const appointment = await Appointment.findByPk(id, {
            include: [{ model: Schedule }]
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy cuộc hẹn'
            });
        }

        // Lấy thông tin bệnh nhân
        const patient = await User.findByPk(appointment.patientId);

        // Lấy thông tin schedule và doctor
        const schedule = await Schedule.findByPk(appointment.scheduleId);
        const doctor = await Doctor.findByPk(schedule.doctorId, {
            include: [{
                model: User,
                attributes: ['fullName', 'email', 'phoneNumber']
            }]
        });

        // Nếu hủy cuộc hẹn, cập nhật lại trạng thái lịch và gửi thông báo
        if (status === 'canceled') {
            await schedule.update({ status: 'available' });

            // Gửi email thông báo hủy lịch
            await emailService.sendCancellationNotification(appointment, patient, doctor, schedule);

            // Gửi SMS thông báo hủy lịch
            await smsService.sendCancellationNotification(appointment, patient, doctor, schedule);
        }

        await appointment.update({ status });

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.getMyAppointments = async (req, res) => {
    try {
        const patientId = req.user.id;

        const appointments = await Appointment.findAll({
            where: { patientId },
            include: [
                {
                    model: Schedule,
                    include: [{
                        model: Doctor,
                        include: [{
                            model: User,
                            attributes: ['fullName', 'email', 'phoneNumber']
                        }]
                    }]
                },
                {
                    model: DoctorRating,
                    attributes: ['id', 'rating', 'comment']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.getDoctorAppointments = async (req, res) => {
    try {
        // Tìm thông tin bác sĩ
        const doctor = await Doctor.findOne({
            where: { userId: req.user.id }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin bác sĩ'
            });
        }

        const appointments = await Appointment.findAll({
            include: [
                {
                    model: Schedule,
                    where: { doctorId: doctor.id },
                    include: [{ model: Doctor }]
                },
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'fullName', 'email', 'phoneNumber']
                }
            ],
            order: [
                [Schedule, 'date', 'ASC'],
                [Schedule, 'startTime', 'ASC']
            ]
        });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};