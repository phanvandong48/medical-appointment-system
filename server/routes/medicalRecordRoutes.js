const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/fileUpload');

// Lấy danh sách hồ sơ bệnh án của bệnh nhân
router.get('/patient', protect, medicalRecordController.getPatientRecords);
router.get('/patient/:patientId', protect, authorize('admin', 'doctor'), medicalRecordController.getPatientRecords);

// Xem chi tiết hồ sơ bệnh án
router.get('/:recordId', protect, medicalRecordController.getRecordDetails);

// Tạo hồ sơ bệnh án mới
router.post('/', protect, medicalRecordController.createMedicalRecord);

// Thêm chi tiết vào hồ sơ bệnh án
router.post('/:recordId/details', protect, authorize('admin', 'doctor'), medicalRecordController.addRecordDetail);

// Tải lên file cho chi tiết bệnh án
router.post('/details/:recordDetailId/files', protect, authorize('admin', 'doctor'), upload.single('file'), medicalRecordController.uploadMedicalFile);

// Xóa file y tế
router.delete('/files/:fileId', protect, authorize('admin', 'doctor'), medicalRecordController.deleteMedicalFile);

// Cập nhật hồ sơ bệnh án
router.put('/:recordId', protect, medicalRecordController.updateMedicalRecord);

// Xóa hồ sơ bệnh án
router.delete('/:recordId', protect, authorize('admin'), medicalRecordController.deleteMedicalRecord);

module.exports = router;