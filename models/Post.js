const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');  // Import User model for foreign key reference

const Post = sequelize.define('Post', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,  // References the User model
            key: 'id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    }
}, {
    tableName: 'posts',
    timestamps: false
});

module.exports = Post;
