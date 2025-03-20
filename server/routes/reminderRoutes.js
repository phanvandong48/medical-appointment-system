const express = require('express');
const router = express.Router();
const reminderService = require('../utils/reminderService');
const { protect, authorize } = require('../middleware/auth');

// Endpoint để gửi nhắc nhở lịch hẹn (chỉ admin mới có quyền)
router.post('/send-reminders', protect, authorize('admin'), async (req, res) => {
    try {
        const sentCount = await reminderService.sendDailyReminders();
        res.status(200).json({
            success: true,
            message: `Đã gửi ${sentCount} nhắc nhở lịch hẹn`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi gửi nhắc nhở',
            error: error.message
        });
    }
});

module.exports = router;