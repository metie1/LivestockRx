const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Vaccination = sequelize.define('Vaccination', {
  serialNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Vaccination;
