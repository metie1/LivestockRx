const express = require('express');
const router = express.Router();
const medicationRecordController = require('../controllers/medicationRecordController');

router.post('/medication-records', medicationRecordController.createMedicationRecord);
router.get('/medication-records', medicationRecordController.getMedicationRecords);

module.exports = router;