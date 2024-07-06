module.exports = (sequelize, DataTypes) => {
    const Diagnosis = sequelize.define('Diagnosis', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        symptom_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        diagnosis: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        suggested_medication: {
            type: DataTypes.STRING,
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
        tableName: 'Diagnoses',
    });

    return Diagnosis;
};
