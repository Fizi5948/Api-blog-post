const express = require('express');
const router = express.Router();
const User = require('../Models/User');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Hide passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
