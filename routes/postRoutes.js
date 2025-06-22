const express = require('express');
const router = express.Router();
const Post = require('../Models/Post');
const Comment = require('../Models/Comment');
const auth = require('../Middleware/auth');
const admin = require('../Middleware/admin');

router.post('/', auth, async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.status(201).json(post);
});

router.get('/', async (req, res) => {
  const posts = await Post.find().lean();
  for (let post of posts) {
    post.comments = await Comment.find({ postId: post._id });
  }
  res.json(posts);
});

router.delete('/:id', auth, admin, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: 'Post deleted' });
});

module.exports = router;
