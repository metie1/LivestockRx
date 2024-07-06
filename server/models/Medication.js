module.exports = (sequelize, DataTypes) => {
    const Medication = sequelize.define('Medication', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        animal_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        medication_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dosage: {
            type: DataTypes.STRING,
        },
        start_date: {
            type: DataTypes.DATE,
        },
        end_date: {
            type: DataTypes.DATE,
        },
        vet_id: {
            type: DataTypes.INTEGER,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'updated_at',
        },
    }, {
        timestamps: false,
        tableName: 'Medications',
    });

    return Medication;
};
