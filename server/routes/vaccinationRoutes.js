const express = require('express');
const router = express.Router();
const vaccinationController = require('../controllers/vaccinationController');

router.get('/', vaccinationController.getAllVaccinations);
router.post('/', vaccinationController.addVaccination);

module.exports = router;
