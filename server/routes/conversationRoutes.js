const express = require('express');
const { handleConversation } = require('../controllers/conversationController');

const router = express.Router();

router.post('/conversation', handleConversation);

module.exports = router;
