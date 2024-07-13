const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');    

router.get('/', medicationController.getAllMedications);
router.get('/records', medicationController.getMedicationRecords);

module.exports = router;