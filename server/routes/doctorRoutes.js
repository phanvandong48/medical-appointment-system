const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', doctorController.getAllDoctors);
router.get('/me', protect, authorize('doctor'), doctorController.getDoctorProfile); // Thêm route này
router.get('/:id', doctorController.getDoctorById);
router.get('/:id/schedules', doctorController.getDoctorSchedules);
router.get('/:id/schedules/all', protect, authorize('doctor'), doctorController.getAllDoctorSchedules); // Route này cũng cần thêm

// Bảo vệ route chỉ cho phép bác sĩ truy cập
router.post('/schedules', protect, authorize('doctor'), doctorController.createSchedule);

module.exports = router;