const jwt = require("jsonwebtoken");
const secretKey = require('../utils/tokenKey');
const User = require("../models/User"); // Sequelize model for users

// Get user information by userId
const getUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch user information using Sequelize
    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] } // Exclude password from the response
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update user information
const updateUser = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const userInfo = jwt.verify(token, secretKey);

    // Update user information using Sequelize
    const [updated] = await User.update(
      {
        name: req.body.name,
        city: req.body.city,
        website: req.body.website,
        profilePic: req.body.profilePic,
        coverPic: req.body.coverPic
      },
      {
        where: { id: userInfo.id }
      }
    );

    if (updated) {
      return res.json("Updated!");
    } else {
      return res.status(403).json("You can update only your own profile!");
    }
  } catch (err) {
    console.error("Error updating user:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json("Token is not valid!");
    }
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUser,
  updateUser
};
