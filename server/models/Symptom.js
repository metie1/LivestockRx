module.exports = (sequelize, DataTypes) => {
    const Symptom = sequelize.define('Symptom', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        animal_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        symptom_description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        severity: {
            type: DataTypes.ENUM('mild', 'moderate', 'severe'),
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
        tableName: 'Symptoms',
    });

    return Symptom;
};
