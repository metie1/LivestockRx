const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const animalRoutes = require('./routes/animalRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const vaccinationRoutes = require('./routes/vaccinationRoutes');

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/', animalRoutes);
app.use('/api/calendar', calendarRoutes);

app.use('/api', animalRoutes);
app.use('/api', conversationRoutes);
app.use('/api/vaccination', vaccinationRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
db.sequelize.sync({ alter: true }).then(() => {
  console.log('Database synchronized');
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Unable to sync database:', err);
});