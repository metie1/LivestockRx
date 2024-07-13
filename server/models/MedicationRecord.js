module.exports = (sequelize, DataTypes) => {
    const MedicationRecord = sequelize.define('MedicationRecord', {
        date: DataTypes.DATE,
        dosage: DataTypes.STRING,
        notes: DataTypes.TEXT
    });
    
    MedicationRecord.associate = function(models) {
        MedicationRecord.belongsTo(models.Animal, { foreignKey: 'animal_id' });
        MedicationRecord.belongsTo(models.Medication, { foreignKey: 'medication_id' });
    };

    return MedicationRecord;
};