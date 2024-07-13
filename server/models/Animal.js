module.exports = (sequelize, DataTypes) => {
    const Animal = sequelize.define('Animal', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        tag_number: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        species: {
            type: DataTypes.ENUM('cow', 'pig'),
            allowNull: false,
        },
        birth_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        gender: {
            type: DataTypes.ENUM('male', 'female'),
            allowNull: false,
        },
        weight: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        slaughter_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        memo: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    }, {
        tableName: 'Animals',
        timestamps: true,
        underscored: true,
        indexes: [
            // Add a unique constraint on the combination of tag_number and user_id
            {
                unique: true,
                fields: ['tag_number', 'user_id']
            }
        ]
    });

    Animal.associate = function(models) {
        Animal.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Animal.hasMany(models.Vaccination, { foreignKey: 'animal_id', as: 'vaccinations' });
        Animal.hasMany(models.MedicationRecord, { foreignKey: 'animal_id', as: 'medicationRecords' });
    };

    return Animal;
};