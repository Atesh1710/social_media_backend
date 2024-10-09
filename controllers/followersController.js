const jwt = require("jsonwebtoken");
const { Follower, User } = require("../models"); // Import your models
const secretKey = require('../utils/tokenKey');

// Get list of followers for a user
const getFollowers = async (req, res) => {
    try {
        const followedUserId = req.query.followedUserId;
        const followers = await Follower.findAll({
            where: { followed_id: followedUserId },
            attributes: ['follower_id'],
        });

        return res.status(200).json(followers.map(relationship => relationship.follower_id));
    } catch (err) {
        console.error("Error fetching followers:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Add a new follower
const addFollower = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    try {
        const userInfo = jwt.verify(token, secretKey);
        
        // Create a new follower entry
        await Follower.create({
            follower_id: userInfo.id,
            followed_id: req.body.userId,
        });

        return res.status(200).json("Following");
    } catch (err) {
        console.error("Error adding follower:", err);
        if (err.name === "JsonWebTokenError") {
            return res.status(403).json("Token is not valid!");
        }
        return res.status(500).json({ message: "Server error" });
    }
};

// Remove a follower
const deleteFollower = async (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    try {
        const userInfo = jwt.verify(token, secretKey);
        
        // Delete the follower entry
        await Follower.destroy({
            where: {
                follower_id: userInfo.id,
                followed_id: req.query.userId,
            },
        });

        return res.status(200).json("Unfollowed");
    } catch (err) {
        console.error("Error deleting follower:", err);
        if (err.name === "JsonWebTokenError") {
            return res.status(403).json("Token is not valid!");
        }
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getFollowers,
    addFollower,
    deleteFollower
};
