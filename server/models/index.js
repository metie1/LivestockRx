const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const User = require('./User')(sequelize, DataTypes);
const Animal = require('./Animal')(sequelize, DataTypes);
const Symptom = require('./Symptom')(sequelize, DataTypes);
const Diagnosis = require('./Diagnosis')(sequelize, DataTypes);
const Medication = require('./Medication')(sequelize, DataTypes);
const Vaccination = require('./Vaccination')(sequelize, DataTypes);
const CalendarEvent = require('./CalendarEvent')(sequelize, DataTypes);

// Define associations
Animal.hasMany(Symptom, { foreignKey: 'animal_id' });
Symptom.belongsTo(Animal, { foreignKey: 'animal_id' });

Symptom.hasMany(Diagnosis, { foreignKey: 'symptom_id' });
Diagnosis.belongsTo(Symptom, { foreignKey: 'symptom_id' });

Animal.hasMany(Medication, { foreignKey: 'animal_id' });
Medication.belongsTo(Animal, { foreignKey: 'animal_id' });

Animal.hasMany(Vaccination, { foreignKey: 'animal_id' });
Vaccination.belongsTo(Animal, { foreignKey: 'animal_id' });

Animal.hasMany(CalendarEvent, { foreignKey: 'animal_id' });
CalendarEvent.belongsTo(Animal, { foreignKey: 'animal_id' });


sequelize.sync()
.then(() => {
    console.log('Database & tables created!');
});

const db = {
    User,
    Animal,
    Symptom,
    Diagnosis,
    Medication,
    Vaccination,
    CalendarEvent,
    sequelize,
    Sequelize,
};

module.exports = db;
