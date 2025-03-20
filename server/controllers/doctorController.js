const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Schedule = require('../models/Schedule');
const { Op } = require('sequelize');

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'fullName', 'email', 'phoneNumber']
                }
            ]
        });

        res.status(200).json(doctors);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'fullName', 'email', 'phoneNumber']
                }
            ]
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bác sĩ'
            });
        }

        res.status(200).json(doctor);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.getDoctorSchedules = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const currentDate = new Date();

        const schedules = await Schedule.findAll({
            where: {
                doctorId,
                date: {
                    [Op.gte]: currentDate
                },
                status: 'available'
            },
            order: [
                ['date', 'ASC'],
                ['startTime', 'ASC']
            ]
        });

        res.status(200).json(schedules);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.createSchedule = async (req, res) => {
    try {
        const { date, startTime, endTime } = req.body;

        // Tìm thông tin bác sĩ dựa vào userId
        const doctor = await Doctor.findOne({
            where: { userId: req.user.id }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin bác sĩ'
            });
        }

        const schedule = await Schedule.create({
            doctorId: doctor.id,
            date,
            startTime,
            endTime,
            status: 'available'
        });

        res.status(201).json({
            success: true,
            data: schedule
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            where: { userId: req.user.id },
            include: [
                {
                    model: User,
                    attributes: ['id', 'fullName', 'email', 'phoneNumber']
                }
            ]
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin bác sĩ'
            });
        }

        res.status(200).json(doctor);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.getAllDoctorSchedules = async (req, res) => {
    try {
        const doctorId = req.params.id;

        // Kiểm tra quyền truy cập - bác sĩ chỉ có thể xem lịch của mình
        const doctor = await Doctor.findOne({
            where: { userId: req.user.id }
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin bác sĩ'
            });
        }

        // Nếu ID không khớp (bác sĩ đang cố xem lịch của bác sĩ khác)
        if (doctor.id.toString() !== doctorId && doctorId !== 'me') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xem lịch của bác sĩ khác'
            });
        }

        // Nếu doctorId là 'me', sử dụng ID của bác sĩ đang đăng nhập
        const queryDoctorId = doctorId === 'me' ? doctor.id : doctorId;

        const schedules = await Schedule.findAll({
            where: {
                doctorId: queryDoctorId
            },
            order: [
                ['date', 'ASC'],
                ['startTime', 'ASC']
            ]
        });

        res.status(200).json(schedules);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};