const jwt = require("jsonwebtoken");
const moment = require("moment");
const secretKey = require('../utils/tokenKey');
const { Post, User, Follower } = require("../models"); // Update imports to use Follower model

// Get posts
const getPosts = async (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, secretKey);
    let whereCondition = {};
    let orderCondition = [['createdAt', 'DESC']]; // Sequelize uses camelCase for timestamps

    if (userId !== "undefined") {
      whereCondition = { userId: userId }; // Filter by userId
    } else {
      // Fetch posts of followed users and the logged-in user
      const followedUsers = await Follower.findAll({
        where: { follower_id: userInfo.id }, // Assuming follower_id is the ID of the user following
        attributes: ['followed_id'] // Assuming followed_id is the ID of the user being followed
      });

      const followedUserIds = followedUsers.map(f => f.followed_id);
      followedUserIds.push(userInfo.id); // Include the logged-in user

      whereCondition = { userId: followedUserIds }; // Get posts from followed users
    }

    const posts = await Post.findAll({
      where: whereCondition,
      include: [{
        model: User,
        attributes: ['id', 'name', 'profilePic']
      }],
      order: orderCondition
    });

    return res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json("Token is not valid!");
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// Add a new post
const addPost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, secretKey);
    const newPost = await Post.create({
      content: req.body.content,
      image: req.body.image,
      createdAt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), // Sequelize uses camelCase
      userId: userInfo.id,
    });

    return res.status(200).json("Post has been created.");
  } catch (err) {
    console.error("Error adding post:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json("Token is not valid!");
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, secretKey);
    const result = await Post.destroy({
      where: {
        id: req.params.id,
        userId: userInfo.id
      }
    });

    if (result > 0) {
      return res.status(200).json("Post has been deleted.");
    }
    return res.status(403).json("You can delete only your post");
  } catch (err) {
    console.error("Error deleting post:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json("Token is not valid!");
    }
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getPosts,
  addPost,
  deletePost,
};
