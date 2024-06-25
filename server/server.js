const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./config/dbConfig');
const authRoutes = require('./routes/authRoutes');
const animalRoutes = require('./routes/animalRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const vaccinationRoutes = require('./routes/vaccinationRoutes');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use('/api', authRoutes);
app.use('/api', animalRoutes);
app.use('/api', conversationRoutes);
app.use('/api', vaccinationRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
