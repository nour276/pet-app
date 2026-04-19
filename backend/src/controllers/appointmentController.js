const pool = require('../config/db');

const createAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pet_id, vet_name, appointment_date, reason } = req.body;

    if (!pet_id || !vet_name || !appointment_date) {
      return res.status(400).json({
        message: 'pet_id, vet_name and appointment_date are required',
      });
    }

    const petCheck = await pool.query(
      'SELECT * FROM pets WHERE id = $1 AND user_id = $2',
      [pet_id, userId]
    );

    if (petCheck.rows.length === 0) {
      return res.status(404).json({
        message: 'Pet not found or does not belong to this user',
      });
    }

    const newAppointment = await pool.query(
      `INSERT INTO appointments (user_id, pet_id, vet_name, appointment_date, reason)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, pet_id, vet_name, appointment_date, reason || null]
    );

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: newAppointment.rows[0],
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await pool.query(
      `SELECT 
         appointments.*,
         pets.name AS pet_name,
         pets.type AS pet_type
       FROM appointments
       JOIN pets ON appointments.pet_id = pets.id
       WHERE appointments.user_id = $1
       ORDER BY appointment_date ASC`,
      [userId]
    );

    res.status(200).json({
      message: 'Appointments fetched successfully',
      appointments: appointments.rows,
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createAppointment, getMyAppointments };