const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// 로그인 컨트롤러
exports.login = async (req, res) => {
  try {
    // 사용자 확인
    const { username, password } = req.body;
    console.log('Login attempt for username:', username); // 로그 추가
    
    const user = await User.findOne({ 
      where: { username },
      attributes: ['id', 'username', 'password', 'email', 'role', 'created_at']
    });
    if (!user) {
      console.log('User not found:', username); // 로그 추가
      return res.status(404).json({ message: 'User not found' });
    }

    // 비밀번호 확인
    console.log('User found, comparing passwords'); // 로그 추가
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials for user:', username); // 로그 추가
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // JWT 토큰 생성
    console.log('Password match, creating token'); // 로그 추가
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 회원가입 컨트롤러
exports.register = async (req, res) => {
  /*
  if (!username || !password || !email || !role) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
  }
    */
  try {
    const { username, password, email, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해시화

    /*
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: '이미 존재하는 아이디입니다.' });
    }
    */

    // 사용자 생성
    const user = await User.create({ username, password: hashedPassword, email, role });
    res.status(201).json({ message: 'User registered successfully' });
  } 

  catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};