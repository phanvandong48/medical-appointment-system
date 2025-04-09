const MedicalRecord = require('../models/MedicalRecord');
const MedicalRecordDetail = require('../models/MedicalRecordDetail');
const MedicalFile = require('../models/MedicalFile');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Danh sách hồ sơ bệnh án của bệnh nhân
exports.getPatientRecords = async (req, res) => {
    try {
        // Lấy ID của bệnh nhân từ token hoặc tham số
        const patientId = req.user.role === 'patient' ? req.user.id : req.params.patientId;

        // Kiểm tra quyền hạn
        if (req.user.role !== 'admin' && req.user.role !== 'doctor' && req.user.id !== patientId) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xem hồ sơ bệnh án này'
            });
        }

        const records = await MedicalRecord.findAll({
            where: { patientId },
            include: [{
                model: User,
                as: 'patient',
                attributes: ['id', 'fullName', 'email', 'phoneNumber']
            }],
            order: [['updatedAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: records
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Chi tiết một hồ sơ bệnh án
exports.getRecordDetails = async (req, res) => {
    try {
        const { recordId } = req.params;

        const record = await MedicalRecord.findByPk(recordId, {
            include: [{
                model: User,
                as: 'patient',
                attributes: ['id', 'fullName', 'email', 'phoneNumber']
            }]
        });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hồ sơ bệnh án'
            });
        }

        // Kiểm tra quyền hạn
        if (req.user.role !== 'admin' && req.user.role !== 'doctor' && req.user.id !== record.patientId) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xem hồ sơ bệnh án này'
            });
        }

        const details = await MedicalRecordDetail.findAll({
            where: { recordId },
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
                    attributes: ['id', 'reason', 'status', 'createdAt']
                },
                {
                    model: MedicalFile
                }
            ],
            order: [['recordDate', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: {
                record,
                details
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Tạo hồ sơ bệnh án mới
exports.createMedicalRecord = async (req, res) => {
    try {
        const { title, description } = req.body;
        let patientId = req.user.id;

        // Cho phép bác sĩ hoặc admin tạo hồ sơ cho bệnh nhân
        if ((req.user.role === 'doctor' || req.user.role === 'admin') && req.body.patientId) {
            patientId = req.body.patientId;
        }

        const record = await MedicalRecord.create({
            patientId,
            title,
            description
        });

        res.status(201).json({
            success: true,
            data: record
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Thêm chi tiết vào hồ sơ bệnh án
exports.addRecordDetail = async (req, res) => {
    try {
        const { recordId } = req.params;
        const { diagnosis, prescription, notes, recordDate } = req.body;

        // Xử lý appointmentId - chuyển chuỗi rỗng thành null
        const appointmentId = req.body.appointmentId && req.body.appointmentId.trim() !== ''
            ? req.body.appointmentId
            : null;

        const record = await MedicalRecord.findByPk(recordId);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hồ sơ bệnh án'
            });
        }

        // Kiểm tra quyền hạn (chỉ bác sĩ và admin có thể thêm chi tiết)
        if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thêm chi tiết vào hồ sơ bệnh án'
            });
        }

        // Lấy thông tin bác sĩ
        const doctor = await Doctor.findOne({
            where: { userId: req.user.id }
        });

        if (!doctor && req.user.role === 'doctor') {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin bác sĩ'
            });
        }

        const doctorId = doctor ? doctor.id : req.body.doctorId;

        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: 'Cần cung cấp ID bác sĩ'
            });
        }

        // Kiểm tra appointmentId có tồn tại không (nếu có)
        if (appointmentId !== null) {
            const appointment = await Appointment.findByPk(appointmentId);
            if (!appointment) {
                return res.status(400).json({
                    success: false,
                    message: 'Cuộc hẹn không tồn tại'
                });
            }
        }

        const recordDetail = await MedicalRecordDetail.create({
            recordId,
            appointmentId, // Đã được xử lý thành null hoặc ID hợp lệ
            doctorId,
            diagnosis,
            prescription,
            notes,
            recordDate: recordDate || new Date()
        });

        res.status(201).json({
            success: true,
            data: recordDetail
        });
    } catch (error) {
        console.error('Lỗi khi thêm chi tiết bệnh án:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + error.message
        });
    }
};

// Tải lên file cho chi tiết bệnh án
exports.uploadMedicalFile = async (req, res) => {
    try {
        const { recordDetailId } = req.params;

        const recordDetail = await MedicalRecordDetail.findByPk(recordDetailId, {
            include: [{ model: MedicalRecord }]
        });

        if (!recordDetail) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy chi tiết hồ sơ bệnh án'
            });
        }

        // Kiểm tra quyền hạn
        if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền tải lên file cho hồ sơ bệnh án'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Không có file nào được tải lên'
            });
        }

        // Xác định loại file
        let fileType = 'document';
        if (req.file.mimetype.startsWith('image')) {
            fileType = 'image';
        } else if (req.file.mimetype === 'application/pdf') {
            fileType = 'pdf';
        }

        const file = await MedicalFile.create({
            recordDetailId,
            fileType,
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size
        });

        res.status(201).json({
            success: true,
            data: file
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Xóa file y tế
exports.deleteMedicalFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        const file = await MedicalFile.findByPk(fileId, {
            include: [{
                model: MedicalRecordDetail,
                include: [{ model: MedicalRecord }]
            }]
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy file'
            });
        }

        // Kiểm tra quyền hạn
        if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xóa file này'
            });
        }

        // Xóa file từ hệ thống file
        const filePath = file.filePath;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Xóa bản ghi từ database
        await file.destroy();

        res.status(200).json({
            success: true,
            message: 'Đã xóa file thành công'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Cập nhật hồ sơ bệnh án
exports.updateMedicalRecord = async (req, res) => {
    try {
        const { recordId } = req.params;
        const { title, description } = req.body;

        const record = await MedicalRecord.findByPk(recordId);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hồ sơ bệnh án'
            });
        }

        // Kiểm tra quyền hạn
        if (req.user.role !== 'admin' && req.user.role !== 'doctor' && req.user.id !== record.patientId) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền cập nhật hồ sơ bệnh án này'
            });
        }

        await record.update({
            title,
            description
        });

        res.status(200).json({
            success: true,
            data: record
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Xóa hồ sơ bệnh án
exports.deleteMedicalRecord = async (req, res) => {
    try {
        const { recordId } = req.params;

        const record = await MedicalRecord.findByPk(recordId);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hồ sơ bệnh án'
            });
        }

        // Kiểm tra quyền hạn (chỉ admin mới có quyền xóa hoàn toàn)
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xóa hồ sơ bệnh án'
            });
        }

        // Xóa tất cả các file liên quan
        const details = await MedicalRecordDetail.findAll({
            where: { recordId },
            include: [{ model: MedicalFile }]
        });

        for (const detail of details) {
            for (const file of detail.MedicalFiles) {
                if (fs.existsSync(file.filePath)) {
                    fs.unlinkSync(file.filePath);
                }
                await file.destroy();
            }
            await detail.destroy();
        }

        // Xóa hồ sơ
        await record.destroy();

        res.status(200).json({
            success: true,
            message: 'Đã xóa hồ sơ bệnh án thành công'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};