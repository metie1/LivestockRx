const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

router.post('/events', calendarController.createEvent);
router.get('/events', calendarController.getEvents);

module.exports = router;
