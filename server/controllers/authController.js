const User = require('../models/User');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');

// Tạo token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

exports.register = async (req, res) => {
    try {
        const { email, password, fullName, phoneNumber, role, specialization, experience, description } = req.body;

        // Tạo user
        const user = await User.create({
            email,
            password,
            fullName,
            phoneNumber,
            role: role || 'patient'
        });

        // Nếu là bác sĩ, tạo thông tin bác sĩ
        if (role === 'doctor') {
            await Doctor.create({
                userId: user.id,
                specialization,
                experience,
                description
            });
        }

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email không tồn tại'
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Mật khẩu không chính xác'
            });
        }

        const token = generateToken(user);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};