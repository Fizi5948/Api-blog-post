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



router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

   
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


module.exports = router;
