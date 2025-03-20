const { DoctorRating, Doctor, User, Appointment, Schedule } = require('../models');
const { Op } = require('sequelize');

// Thêm đánh giá mới cho bác sĩ
exports.addRating = async (req, res) => {
    try {
        const { appointmentId, rating, comment } = req.body;
        const patientId = req.user.id;

        // Kiểm tra xem cuộc hẹn có tồn tại và thuộc về bệnh nhân này không
        const appointment = await Appointment.findOne({
            where: {
                id: appointmentId,
                patientId,
                status: 'completed' // Chỉ cho phép đánh giá các cuộc hẹn đã hoàn thành
            },
            include: [{
                model: Schedule,
                include: [{
                    model: Doctor
                }]
            }]
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy cuộc hẹn hoặc cuộc hẹn chưa hoàn thành'
            });
        }

        // Kiểm tra xem đã có đánh giá cho cuộc hẹn này chưa
        const existingRating = await DoctorRating.findOne({
            where: { appointmentId }
        });

        if (existingRating) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã đánh giá cho cuộc hẹn này'
            });
        }

        // Tạo đánh giá mới
        const doctorId = appointment.Schedule.Doctor.id;
        const newRating = await DoctorRating.create({
            rating,
            comment,
            patientId,
            doctorId,
            appointmentId
        });

        res.status(201).json({
            success: true,
            data: newRating
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy danh sách đánh giá cho một bác sĩ
exports.getDoctorRatings = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // Kiểm tra xem bác sĩ có tồn tại không
        const doctor = await Doctor.findByPk(doctorId, {
            include: [{
                model: User,
                attributes: ['fullName']
            }]
        });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy bác sĩ'
            });
        }

        // Lấy danh sách đánh giá
        const ratings = await DoctorRating.findAll({
            where: { doctorId },
            include: [{
                model: User,
                as: 'patient',
                attributes: ['id', 'fullName']
            }],
            order: [['createdAt', 'DESC']]
        });

        // Tính điểm trung bình
        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0
            ? ratings.reduce((sum, item) => sum + item.rating, 0) / totalRatings
            : 0;

        res.status(200).json({
            success: true,
            data: {
                doctor,
                ratings,
                stats: {
                    totalRatings,
                    averageRating: parseFloat(averageRating.toFixed(1))
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy danh sách đánh giá của bệnh nhân hiện tại
exports.getMyRatings = async (req, res) => {
    try {
        const patientId = req.user.id;

        const ratings = await DoctorRating.findAll({
            where: { patientId },
            include: [
                {
                    model: Doctor,
                    include: [{
                        model: User,
                        attributes: ['fullName']
                    }]
                },
                {
                    model: Appointment,
                    attributes: ['id', 'createdAt'],
                    include: [{
                        model: Schedule,
                        attributes: ['date', 'startTime', 'endTime']
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: ratings
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Cập nhật đánh giá
exports.updateRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const { rating, comment } = req.body;
        const patientId = req.user.id;

        const existingRating = await DoctorRating.findOne({
            where: {
                id: ratingId,
                patientId // Chỉ cho phép bệnh nhân cập nhật đánh giá của chính họ
            }
        });

        if (!existingRating) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đánh giá hoặc bạn không có quyền cập nhật'
            });
        }

        // Cập nhật đánh giá
        await existingRating.update({
            rating,
            comment
        });

        res.status(200).json({
            success: true,
            data: existingRating
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Xóa đánh giá
exports.deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const patientId = req.user.id;

        const existingRating = await DoctorRating.findOne({
            where: {
                id: ratingId,
                patientId // Chỉ cho phép bệnh nhân xóa đánh giá của chính họ
            }
        });

        if (!existingRating) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đánh giá hoặc bạn không có quyền xóa'
            });
        }

        // Xóa đánh giá
        await existingRating.destroy();

        res.status(200).json({
            success: true,
            message: 'Đã xóa đánh giá thành công'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}; 