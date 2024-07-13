const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const authMiddleware = require('../middleware/auth');

router.get('/animals', authMiddleware, animalController.getAllAnimals);
router.get('/my-animals', authMiddleware, animalController.getMyAnimals);
router.get('/animals/:id', authMiddleware, animalController.getAnimalDetails);
router.post('/animals', authMiddleware, animalController.createAnimal);

module.exports = router;