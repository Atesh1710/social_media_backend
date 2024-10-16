const express = require("express");
const {getPosts, addPost, deletePost} = require("../controllers/postController");

const router = express.Router();

router.get('/',getPosts);
router.post('/',addPost);
router.delete('/:id',deletePost);

module.exports = router;