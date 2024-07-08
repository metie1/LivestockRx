const express = require('express');
const router = express.Router();
const { Animal } = require('../models');

router.get('/animals', async (req, res) => {
    try {
        const animals = await Animal.findAll({
            attributes: ['id', 'tag_number', 'species']
        });
        res.json(animals);
    } catch (error) {
        console.error('Error fetching animals:', error);
        res.status(500).json({ message: 'Error fetching animals', error: error.message });
    }
});

module.exports = router;