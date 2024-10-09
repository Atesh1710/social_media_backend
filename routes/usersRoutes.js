const express = require("express");
const {getUser,updateUser} = require("../controllers/userController");

const router = express.Router();

router.get('/find/:userId',getUser)
router.put('/',updateUser)

module.exports = router;