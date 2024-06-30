const express = require('express');
const { getVaccinations } = require('../controllers/vaccinationController');

const router = express.Router();

router.get('/vaccination', getVaccinations);

module.exports = router;
    