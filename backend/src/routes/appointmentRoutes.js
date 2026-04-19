const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createAppointment,
  getMyAppointments,
} = require('../controllers/appointmentController');

router.post('/', authMiddleware, createAppointment);
router.get('/', authMiddleware, getMyAppointments);

module.exports = router;