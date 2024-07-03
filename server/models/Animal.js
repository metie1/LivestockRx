const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Animal = sequelize.define('Animal', {
    tag_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    species: {
        type: DataTypes.ENUM('cow', 'pig'),
        allowNull: false
    },
    birth_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false
    },
    weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Animal;
