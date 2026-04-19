const pool = require('../config/db');

const addPet = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, type, breed, age, weight, image } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    const newPet = await pool.query(
      `INSERT INTO pets (user_id, name, type, breed, age, weight, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, name, type, breed || null, age || null, weight || null, image || null]
    );

    res.status(201).json({
      message: 'Pet added successfully',
      pet: newPet.rows[0],
    });
  } catch (error) {
    console.error('Add pet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyPets = async (req, res) => {
  try {
    const userId = req.user.id;

    const pets = await pool.query(
      'SELECT * FROM pets WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );

    res.status(200).json({
      message: 'Pets fetched successfully',
      pets: pets.rows,
    });
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addPet, getMyPets };