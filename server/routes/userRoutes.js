const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Route lấy danh sách tất cả bệnh nhân - chỉ doctor và admin có quyền
router.get('/patients', protect, authorize('admin', 'doctor'), userController.getAllPatients);

// Route lấy thông tin chi tiết người dùng
router.get('/:id', protect, userController.getUserById);

// Route cập nhật thông tin người dùng
router.put('/:id', protect, userController.updateUser);

module.exports = router; 