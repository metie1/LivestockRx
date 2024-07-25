const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');
const authMiddleware = require('../middleware/auth');  

router.get('/', medicationController.getAllMedications);
router.get('/records', medicationController.getMedicationRecords);
router.get('/upcoming', authMiddleware, medicationController.getUpcomingMedications);

module.exports = router;