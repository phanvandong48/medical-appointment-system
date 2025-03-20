const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { protect, authorize } = require('../middleware/auth');

// Thêm đánh giá mới
router.post('/', protect, authorize('patient'), ratingController.addRating);

// Lấy danh sách đánh giá của bác sĩ
router.get('/doctor/:doctorId', ratingController.getDoctorRatings);

// Lấy danh sách đánh giá của bệnh nhân hiện tại
router.get('/my-ratings', protect, authorize('patient'), ratingController.getMyRatings);

// Cập nhật đánh giá
router.put('/:ratingId', protect, authorize('patient'), ratingController.updateRating);

// Xóa đánh giá
router.delete('/:ratingId', protect, authorize('patient'), ratingController.deleteRating);

module.exports = router; 