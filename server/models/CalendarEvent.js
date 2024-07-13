module.exports = (sequelize, DataTypes) => {
    const CalendarEvent = sequelize.define('CalendarEvent', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        start: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        backgroundColor: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        animal_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        event_type: {
            type: DataTypes.ENUM('vaccination', 'medication', 'checkup'),
            allowNull: false,
        },
        user_id: {  // 새로 추가된 필드
            type: DataTypes.INTEGER,
            allowNull: false,
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
        tableName: 'CalendarEvents',
        timestamps: true,
        underscored: true,
    });

    CalendarEvent.associate = function(models) {
        CalendarEvent.belongsTo(models.Animal, { foreignKey: 'animal_id', as: 'animal' });
        CalendarEvent.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });  // 새로운 관계 추가
    };

    return CalendarEvent;
};