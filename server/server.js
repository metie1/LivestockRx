const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const db = require('./models');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const authRoutes = require('./routes/authRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const animalRoutes = require('./routes/animalRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const vaccinationRoutes = require('./routes/vaccinationRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const medicationRecordRoutes = require('./routes/medicationRecordRoutes');
const healthCheckRoutes = require('./routes/healthCheckRoutes');

const userRoutes = require('./routes/userRoutes');

const app = express();

console.log('JWT_SECRET:', process.env.JWT_SECRET);

// 수정버전 2
/*
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000'];
*/

// 미들웨어 설정
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourapp.ngrok.io'],

  // 수정버전 2
  /*
  origin: function(origin, callback) {
    const allowedOrigins = ['http://localhost:3000', 'https://15d2-59-2-103-225.ngrok-free.app'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  */

  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // 수정버전
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// 라우트 설정
app.use('/api/medications', medicationRoutes);
app.use('/api', medicationRecordRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', animalRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/users', userRoutes);
app.use('/api', healthCheckRoutes);

app.use('/api', conversationRoutes);

// React 앱의 정적 파일 제공
app.use(express.static(path.join(__dirname, '../client/build')));

// API가 아닌 모든 요청을 React 앱으로 전달
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// 에러 핸들러 설정
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

db.sequelize.sync({ alter: false, force: false  }).then(() => {
  console.log('Database synchronized');

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

}).catch(err => {
  console.error('Unable to sync database:', err);
});