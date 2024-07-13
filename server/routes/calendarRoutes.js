const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);  // 모든 라우트에 인증 미들웨어 적용

router.post('/events', calendarController.createEvent);
router.get('/events', calendarController.getEvents);
router.put('/events/:id', calendarController.updateEvent);
router.delete('/events/:id', calendarController.deleteEvent);

module.exports = router;
