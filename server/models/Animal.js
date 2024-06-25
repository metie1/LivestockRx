const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Animal = sequelize.define('Animal', {
  serialNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weight: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  medicineUsage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vaccinationRecord: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  slaughterDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  recordDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = Animal;
