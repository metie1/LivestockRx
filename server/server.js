const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const db = require('./models');
const dotenv = require('dotenv');
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

// 미들웨어 설정
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
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