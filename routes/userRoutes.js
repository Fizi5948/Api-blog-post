const express = require('express');
const router = express.Router();
const User = require('../Models/User');


router.get('/', async (req, res) => {
  try {
    const users = await User.find({}); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.get('/debug', async (req, res) => {
  const all = await User.find({}, 'username password role');
  res.json(all);
});


module.exports = router;
