const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Symptom = require('./Symptom');

const Diagnosis = sequelize.define('Diagnosis', {
    symptom_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Symptom,
            key: 'id'
        }
    },
    diagnosis: {
        type: DataTypes.STRING,
        allowNull: false
    },
    suggested_medication: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

Symptom.hasMany(Diagnosis, { foreignKey: 'symptom_id', onDelete: 'CASCADE' });
Diagnosis.belongsTo(Symptom, { foreignKey: 'symptom_id' });

module.exports = Diagnosis;
