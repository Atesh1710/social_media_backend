const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Import the User model created with Sequelize
const secretKey = require('../utils/tokenKey');
const { Op } = require('sequelize'); // Import Op from Sequelize

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password, profile_image } = req.body;

    if (!username || !email || !password || !profile_image) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user exists
    const userCheck = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (userCheck) {
      return res.status(409).json("Username or email already exists!");
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert new user using Sequelize
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profile_image
    });

    return res.status(200).json({ message: "User has been created.", userId: newUser.id });
  } catch (err) {
    console.error("Error during registration:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Get user by username using Sequelize
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) {
      return res.status(400).json("Wrong password or username!");
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });  // Token valid for 1 hour

    const { password: userPassword, ...others } = user.get({ plain: true });
    res.cookie("accessToken", token, { httpOnly: true, secure: true, sameSite: 'none' })
       .status(200)
       .json(others);
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Logout user
const logout = (req, res) => {
  try {
    res.clearCookie("accessToken", { secure: true, sameSite: "none" })
       .status(200)
       .json("User has been logged out.");
  } catch (err) {
    console.error("Error during logout:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  logout,
};
