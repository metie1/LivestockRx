const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const authRoutes = require('./routes/authRoutes'); // 라우트 파일 경로
const sequelize = require('./config/dbConfig'); // DB 설정 파일 경로
const User = require('./models/User');
const animalRoutes = require('./routes/animalRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const vaccinationRoutes = require('./routes/vaccinationRoutes');

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api', animalRoutes);
app.use('/api', conversationRoutes);
app.use('/api', vaccinationRoutes);

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// 데이터베이스 연결 테스트
sequelize.authenticate().then(() => {
  console.log('Connection to the database has been established successfully.');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});