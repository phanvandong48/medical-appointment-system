const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('patient'), appointmentController.createAppointment);
router.get('/my-appointments', protect, appointmentController.getMyAppointments);
router.get('/doctor-appointments', protect, authorize('doctor'), appointmentController.getDoctorAppointments);
router.put('/:id/status', protect, appointmentController.updateAppointmentStatus);

module.exports = router;