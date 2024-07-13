const express = require('express');
const router = express.Router();
const healthCheckController = require('../controllers/healthCheckController');
const authMiddleware = require('../middleware/auth');

router.post('/health-check', authMiddleware, healthCheckController.submitHealthCheck);

module.exports = router;