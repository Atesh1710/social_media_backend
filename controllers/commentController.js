const jwt = require("jsonwebtoken");
const moment = require("moment");
const Comment = require("../models/Comment");  // Sequelize model for comments
const User = require("../models/User");        // Sequelize model for users
const secretKey = require('../utils/tokenKey');

// Get comments for a post
const getComments = async (req, res) => {
  try {
    const postId = req.query.postId;

    // Fetch comments with user details using Sequelize associations
    const comments = await Comment.findAll({
      where: { post_id: postId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'profilePic']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Add a new comment
const addComment = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const userInfo = jwt.verify(token, secretKey);

    // Insert new comment using Sequelize
    const newComment = await Comment.create({
      description: req.body.desc,
      created_at: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      user_id: userInfo.id,
      post_id: req.body.postId
    });

    return res.status(200).json("Comment has been created.");
  } catch (err) {
    console.error("Error adding comment:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json("Token is not valid!");
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const userInfo = jwt.verify(token, secretKey);
    const commentId = req.params.id;

    // Delete comment if the user is the owner
    const deletedComment = await Comment.destroy({
      where: { id: commentId, user_id: userInfo.id }
    });

    if (deletedComment > 0) {
      return res.json("Comment has been deleted!");
    } else {
      return res.status(403).json("You can delete only your comment!");
    }
  } catch (err) {
    console.error("Error deleting comment:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json("Token is not valid!");
    }
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getComments,
  addComment,
  deleteComment
};
