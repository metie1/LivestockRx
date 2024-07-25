const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// 로그인 컨트롤러
exports.login = async (req, res) => {
  const startTime = Date.now();

  try {
    // 사용자 확인
    const { username, password } = req.body;
    console.log(`Login attempt for user: ${username}`);
    
    const user = await User.findOne({ 
      where: { username },
      // attributes: ['id', 'username', 'password', 'email', 'role', 'created_at']
      attributes: ['id', 'username', 'password']
    });
    console.log(`User lookup time: ${Date.now() - startTime}ms`);
    
    if (!user) {
      console.log('User not found:', username); // 로그 추가
      return res.status(404).json({ message: 'User not found' });
    }

    // 비밀번호 확인
    console.log('User found, comparing passwords'); // 로그 추가
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password comparison time: ${Date.now() - startTime}ms`);

    if (!isMatch) {
      console.log('Invalid credentials for user:', username); // 로그 추가
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    

    // JWT 토큰 생성
    console.log('Password match, creating token'); // 로그 추가
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    console.log(`Total login time: ${Date.now() - startTime}ms`);

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ message: 'Internal server error' });
    }

    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    console.log('Token created, sending response');
    res.json({ 
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.toString() });
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

    // 사용자 이름 중복 체크
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: '이미 존재하는 사용자 이름입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해시화

    // 사용자 생성
    const user = await User.create({ username, password: hashedPassword, email, role });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully', token });
  } 
  catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};