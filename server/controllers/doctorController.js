const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Schedule = require('../models/Schedule');
const DoctorRating = require('../models/DoctorRating');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'fullName', 'email', 'phoneNumber']
                },
                {
                    model: DoctorRating,
                    attributes: [],
                    required: false
                }
            ],
            attributes: {
                include: [
                    [
                        sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('DoctorRatings.rating')), 0),
                        'averageRating'
                    ],
                    [
                        sequelize.fn('COUNT', sequelize.col('DoctorRatings.id')),
                        'ratingsCount'
                    ]
                ]
            },
            group: ['Doctor.id', 'User.id']
        });

        // Chuyển đổi kết quả để đảm bảo định dạng số đúng
        const formattedDoctors = doctors.map(doctor => {
            const plainDoctor = doctor.get({ plain: true });

            // Đảm bảo định dạng số cho averageRating
            plainDoctor.averageRating = plainDoctor.averageRating ?
                parseFloat(plainDoctor.averageRating).toFixed(1) : '0.0';

            return plainDoctor;
        });

        res.status(200).json(formattedDoctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
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
                },
                {
                    model: DoctorRating,
                    required: false,
                    include: [{
                        model: User,
                        as: 'patient',
                        attributes: ['fullName']
                    }]
                }
            ],
            attributes: {
                include: [
                    [
                        sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('DoctorRatings.rating')), 0),
                        'averageRating'
                    ],
                    [
                        sequelize.fn('COUNT', sequelize.col('DoctorRatings.id')),
                        'ratingsCount'
                    ]
                ]
            },
            group: ['Doctor.id', 'User.id', 'DoctorRatings.id', 'DoctorRatings->patient.id']
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bác sĩ'
            });
        }

        // Format đánh giá trung bình thành số thập phân
        const plainDoctor = doctor.get({ plain: true });
        plainDoctor.averageRating = plainDoctor.averageRating ?
            parseFloat(plainDoctor.averageRating).toFixed(1) : '0.0';

        res.status(200).json(plainDoctor);
    } catch (error) {
        console.error('Error fetching doctor details:', error);
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