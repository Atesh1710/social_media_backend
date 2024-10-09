const express = require("express");

const {getFollowers,addFollower,deleteFollower} = require("../controllers/followersController");

const router = express.Router();

router.get("/",getFollowers )
router.post("/",addFollower )
router.delete("/",deleteFollower )

module.exports = router;