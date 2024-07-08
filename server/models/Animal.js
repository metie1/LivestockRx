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
        }
    }, {
        tableName: 'Animals',
        timestamps: true,
        underscored: true,
    });

    Animal.associate = function(models) {
        Animal.hasMany(models.CalendarEvent, { foreignKey: 'animal_id', as: 'events' });
    };

    return Animal;
};