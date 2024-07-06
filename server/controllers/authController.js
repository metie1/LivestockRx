const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// 로그인 컨트롤러
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 사용자 확인
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // JWT 토큰 생성
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 회원가입 컨트롤러
exports.register = async (req, res) => {
  const { username, password, email, role } = req.body;

  if (!username || !password || !email || !role) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: '이미 존재하는 아이디입니다.' });
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 20);

    // 사용자 생성
    const user = await User.create({ username, email, password: hashedPassword, role });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } 

  catch (err) {
    console.error('Error during signup:', err);  // 오류 로그 출력
    res.status(500).json({ message: 'Server error' });
  }
};