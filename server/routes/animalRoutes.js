const express = require('express');
const { getAnimalDetail } = require('../controllers/animalController');

const router = express.Router();

router.get('/animals/:id', getAnimalDetail);

module.exports = router;
