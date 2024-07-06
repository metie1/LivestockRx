module.exports = (sequelize, DataTypes) => {
    const Animal = sequelize.define('Animal', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tag_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        species: {
            type: DataTypes.ENUM('cow', 'pig'),
            allowNull: false,
        },
        birth_date: {
            type: DataTypes.DATE,
        },
        gender: {
            type: DataTypes.ENUM('male', 'female'),
            allowNull: false,
        },
        weight: {
            type: DataTypes.DECIMAL(5, 2),
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
        tableName: 'Animals',
    });

    Animal.associate = function(models) {
        Animal.hasMany(models.CalendarEvent, { foreignKey: 'animal_id', onDelete: 'CASCADE' });
    };

    return Animal;
};
