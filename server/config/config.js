require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        dialect: 'mysql',
        "pool": {
        "max": 5,
        "min": 0,
        "acquire": 30000,
        "idle": 10000
        }
    },
    test: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME_TEST,
        host: process.env.DATABASE_HOST,
        dialect: 'mysql'
    },
    production: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME_PRODUCTION,
        host: process.env.DATABASE_HOST,
        dialect: 'mysql'
    }
};