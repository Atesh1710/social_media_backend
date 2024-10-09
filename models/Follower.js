const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Follower = sequelize.define('Follower', {
    follower_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    followed_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    tableName: 'followers',
    timestamps: false,
    primaryKey: false, // We'll manually define the composite key
});

Follower.removeAttribute('id');  // Remove default 'id' field from Sequelize

module.exports = Follower;
