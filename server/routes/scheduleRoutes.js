const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

// Lấy lịch trình của bác sĩ
router.get('/doctor/:id', doctorController.getDoctorSchedules);

// Lấy tất cả lịch trình của bác sĩ (bao gồm cả đã đặt)
router.get('/doctor/:id/all', protect, authorize('doctor'), doctorController.getAllDoctorSchedules);

// Tạo lịch trình mới (chỉ dành cho bác sĩ)
router.post('/', protect, authorize('doctor'), doctorController.createSchedule);

module.exports = router; 