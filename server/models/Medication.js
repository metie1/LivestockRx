module.exports = (sequelize, DataTypes) => {
    const Medication = sequelize.define('Medication', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        허가번호: DataTypes.STRING,
        용도: DataTypes.STRING,
        품목명: DataTypes.STRING,
        성분명: DataTypes.STRING,
        허가일: DataTypes.DATE,
        업체명: DataTypes.STRING,
        사용방법: DataTypes.TEXT,
        사용주기: DataTypes.STRING,
        부작용: DataTypes.TEXT,

        /*
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
            allowNull: false,
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
        tableName: 'Medications',*/
    });

    return Medication;
};