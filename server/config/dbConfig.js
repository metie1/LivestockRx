const { Sequelize } = require('sequelize');
require('dotenv').config();

// console.log(process.env.DATABASE_PORT);
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'mysql',
  port: 3306,
  dialectOptions: {
      ssl: 'Amazon RDS' // AWS RDS의 경우 필요
  }
});

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
