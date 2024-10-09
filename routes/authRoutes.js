const express = require("express");
const {register, login , logout} = require("../controllers/authController");
const router = express.Router();

router.get("", (req,res)=>{
    res.send("workin auth!")
})
router.post('/register',register) 
router.post('/login',login) 
router.post('/logout',logout) 

module.exports = router;