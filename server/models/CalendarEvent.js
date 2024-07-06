module.exports = (sequelize, DataTypes) => {
    const CalendarEvent = sequelize.define('CalendarEvent', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        start: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end: {
            type: DataTypes.DATE,
        },
        backgroundColor: {
            type: DataTypes.STRING,
        },
        animal_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        event_type: {
            type: DataTypes.ENUM('vaccination', 'medication'),
            allowNull: false,
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
        tableName: 'CalendarEvents',
    });

    CalendarEvent.associate = function(models) {
        CalendarEvent.belongsTo(models.Animal, { foreignKey: 'animal_id', onDelete: 'CASCADE' });
    };

    return CalendarEvent;
};
