const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Animal = require('./Animal');

const Symptom = sequelize.define('Symptom', {
    animal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Animal,
            key: 'id'
        }
    },
    symptom_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    severity: {
        type: DataTypes.ENUM('mild', 'moderate', 'severe'),
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

Animal.hasMany(Symptom, { foreignKey: 'animal_id', onDelete: 'CASCADE' });
Symptom.belongsTo(Animal, { foreignKey: 'animal_id' });

module.exports = Symptom;
