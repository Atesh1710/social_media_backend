const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('social_media_backend', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',  // We're using PostgreSQL
    logging: false,       // Disable logging of SQL queries for a cleaner output
});

module.exports = sequelize;
