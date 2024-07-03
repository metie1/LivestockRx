const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Animal = require('./Animal');

const CalendarEvent = sequelize.define('CalendarEvent', {
    event_type: {
        type: DataTypes.ENUM('vaccination', 'medication'),
        allowNull: false
    },
    event_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    event_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

Animal.hasMany(CalendarEvent, { foreignKey: 'animal_id', onDelete: 'CASCADE' });
CalendarEvent.belongsTo(Animal, { foreignKey: 'animal_id' });

module.exports = CalendarEvent;
