const express = require('express');
const router = express.Router();
const vaccinationController = require('../controllers/vaccinationController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, vaccinationController.createVaccination);
router.get('/upcoming', authMiddleware, vaccinationController.getUpcomingVaccinations);
router.get('/', authMiddleware, vaccinationController.getAllVaccinations);

module.exports = router;