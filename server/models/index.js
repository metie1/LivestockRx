const sequelize = require('../config/dbConfig');
const User = require('./User');

sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    });

module.exports = {
    User
};