const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Animal = require('./Animal');
const User = require('./User');

const Vaccination = sequelize.define('Vaccination', {
    vaccine_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

Animal.hasMany(Vaccination, { foreignKey: 'animal_id', onDelete: 'CASCADE' });
User.hasMany(Vaccination, { foreignKey: 'vet_id', onDelete: 'SET NULL' });
Vaccination.belongsTo(Animal, { foreignKey: 'animal_id' });
Vaccination.belongsTo(User, { foreignKey: 'vet_id' });

module.exports = Vaccination;
