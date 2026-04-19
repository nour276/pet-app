const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { addPet, getMyPets } = require('../controllers/petController');

router.post('/', authMiddleware, addPet);
router.get('/', authMiddleware, getMyPets);

module.exports = router;