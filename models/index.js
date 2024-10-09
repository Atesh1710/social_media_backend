const User = require('./User');
const Post = require('./Post');
const Follower = require('./Follower');
const Like = require('./Like');
const Comment = require('./Comment');

// User has many posts
User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });

// User has many followers (and can follow others)
User.belongsToMany(User, {
    through: Follower,
    as: 'Followers',
    foreignKey: 'follower_id',
    otherKey: 'followed_id'
});

// User can like many posts
User.belongsToMany(Post, {
    through: Like,
    foreignKey: 'user_id',
    otherKey: 'post_id'
});
Post.belongsToMany(User, {
    through: Like,
    foreignKey: 'post_id',
    otherKey: 'user_id'
});

// User can comment on posts
User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });
Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });
