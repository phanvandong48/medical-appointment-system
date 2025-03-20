const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const emailService = require('../utils/emailService');
const smsService = require('../utils/smsService');

// Endpoint để gửi thông báo tùy chỉnh (chỉ admin mới có quyền)
router.post('/send-custom', protect, authorize('admin'), async (req, res) => {
    try {
        const { title, content, type } = req.body;

        // Xác định đối tượng người dùng dựa trên loại thông báo
        let whereClause = {};
        if (type === 'patients') {
            whereClause.role = 'patient';
        } else if (type === 'doctors') {
            whereClause.role = 'doctor';
        }

        // Lấy danh sách người dùng
        const users = await User.findAll({ where: whereClause });

        // Đếm số lượng thông báo đã gửi
        let emailCount = 0;

        // Gửi email cho từng người dùng
        for (const user of users) {
            try {
                // Tạo nội dung email HTML
                const emailHtml = `
                    <h2>${title}</h2>
                    <p>Xin chào <strong>${user.fullName}</strong>,</p>
                    <div>${content}</div>
                    <p>Trân trọng,<br>Phòng khám XYZ</p>
                `;

                // Gửi email
                await emailService.sendCustomNotification(user.email, title, emailHtml);
                emailCount++;
            } catch (emailError) {
                console.error(`Lỗi gửi email cho ${user.email}:`, emailError);
            }
        }

        res.status(200).json({
            success: true,
            message: `Đã gửi thông báo cho ${emailCount}/${users.length} người dùng.`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi gửi thông báo tùy chỉnh',
            error: error.message
        });
    }
});

module.exports = router;