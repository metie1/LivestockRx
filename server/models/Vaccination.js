module.exports = (sequelize, DataTypes) => {
    const Vaccination = sequelize.define('Vaccination', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        animal_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        vaccine_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
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
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timestamps: false,
        tableName: 'Vaccinations',
    });

    Vaccination.associate = function(models) {
        Vaccination.belongsTo(models.Animal, { foreignKey: 'animal_id', as: 'animal' });
    };

    return Vaccination;
};
