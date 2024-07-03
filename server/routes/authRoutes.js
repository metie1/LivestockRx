const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController'); // 컨트롤러 파일 경로

// 로그인 라우트
router.post('/login', login);

// 회원가입 라우트
router.post('/register', register);

module.exports = router;