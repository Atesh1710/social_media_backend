const jwt = require("jsonwebtoken");
const secretKey = require('../utils/tokenKey');
const Like = require("../models/Like");  // Sequelize model for the likes table
const User = require("../models/User");  // Sequelize model for users

// Get likes for a post
const getLikes = async (req, res) => {
  try {
    const postId = req.query.postId;

    // Fetch likes for a post using Sequelize
    const likes = await Like.findAll({
      where: { post_id: postId },
      attributes: ['user_id']
    });

    return res.status(200).json(likes.map(like => like.user_id));
  } catch (err) {
    console.error("Error fetching likes:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Add a like to a post
const addLike = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, secretKey);

    // Add a new like using Sequelize
    await Like.create({
      user_id: userInfo.id,
      post_id: req.body.postId
    });

    return res.status(200).json("Post has been liked.");
  } catch (err) {
    console.error("Error adding like:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json("Token is not valid!");
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// Remove a like from a post
const deleteLike = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, secretKey);

    // Remove the like using Sequelize
    const deleted = await Like.destroy({
      where: {
        user_id: userInfo.id,
        post_id: req.query.postId
      }
    });

    if (deleted) {
      return res.status(200).json("Post has been disliked.");
    } else {
      return res.status(403).json("You have not liked this post.");
    }
  } catch (err) {
    console.error("Error deleting like:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json("Token is not valid!");
    }
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getLikes,
  addLike,
  deleteLike
};
