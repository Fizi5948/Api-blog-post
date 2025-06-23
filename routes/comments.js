const express = require('express');
const router = express.Router();
const Comment = require('../Models/Comment');
const authenticate = require('../Middleware/auth');

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().populate('postId', 'title');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error getting comments' });
  }
});


router.post('/', async (req, res) => {
  try {
    const { postId, author, content } = req.body;
    const comment = await Comment.create({ postId, author, content });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: 'Error creating comment', error: err.message });
  }
});


router.delete('/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isAuthor = comment.author === req.user.username;
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Not allowed to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
});
module.exports = router;
