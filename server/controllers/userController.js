const User = require('../models/User');

// Lấy danh sách tất cả bệnh nhân
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await User.findAll({
            where: { role: 'patient' },
            attributes: ['id', 'fullName', 'email', 'phoneNumber'],
            order: [['fullName', 'ASC']]
        });

        res.status(200).json(patients);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy thông tin chi tiết của một người dùng
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Chỉ cho phép người dùng cập nhật thông tin của chính họ hoặc admin
        if (req.user.role !== 'admin' && req.user.id !== user.id) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền cập nhật thông tin này'
            });
        }

        const { fullName, phoneNumber, email } = req.body;

        await user.update({
            fullName,
            phoneNumber,
            email
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}; 