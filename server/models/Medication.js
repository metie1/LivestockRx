const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Animal = require('./Animal');
const User = require('./User');

const Medication = sequelize.define('Medication', {
    medication_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dosage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

Animal.hasMany(Medication, { foreignKey: 'animal_id', onDelete: 'CASCADE' });
User.hasMany(Medication, { foreignKey: 'vet_id', onDelete: 'SET NULL' });
Medication.belongsTo(Animal, { foreignKey: 'animal_id' });
Medication.belongsTo(User, { foreignKey: 'vet_id' });

module.exports = Medication;
