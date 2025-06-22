const express = require('express');
const router = express.Router();
const Comment = require('../Models/Comment');
const auth = require('../Middleware/auth');
const admin = require('../Middleware/admin');

router.post('/:postId/comments', auth, async (req, res) => {
  const comment = new Comment({
    postId: req.params.postId,
    author: req.user._id,
    content: req.body.content
  });
  await comment.save();
  res.status(201).json(comment);
});

router.get('/:postId/comments', async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId });
  res.json(comments);
});

router.delete('/:id', auth, admin, async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Comment deleted' });
});

module.exports = router;