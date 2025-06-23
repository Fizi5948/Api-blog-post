require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const Post = require('./Models/Post');
const User = require('./Models/User');
const postRoutes = require('./routes/postRoutes');
const auth = require('./routes/auth');
const commentRoutes = require('./routes/comments')
const blogPosts = require('./data');
const comments = require('./commentData');
const Comment = require('./Models/Comment');
const userRoutes = require('./routes/userRoutes');
const errorHandle =require('./Middleware/errorhandle')

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(errorHandle);

app.use('/api/posts', postRoutes);
app.use('/api/users',userRoutes)
app.use('/api/post',userRoutes)
app.use('/api/comments',commentRoutes)
app.use('/api/comments/_id',commentRoutes)
app.use('/api/register', auth);
app.use('/api/login',auth)

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log(' MongoDB connected');

  
    try {
      const data = await fs.readFile('./userdata.json', 'utf-8');
      const users = JSON.parse(data);

      for (let user of users) {
        const exists = await User.findOne({ username: user.username });
        if (!exists) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
        await User.create({ ...user, password: hashedPassword });

          console.log(` User '${user.username}' inserted`);
        }
      } 
    } catch (err) {
      console.error(' Error inserting user data:', err.message);
    }
    try {
      for (let post of blogPosts) {
        const exists = await Post.findOne({ title: post.title });
        if (!exists) {
          await Post.create(post);
          console.log(` Post titled "${post.title}" inserted.`);
        }
      }
    } catch (err) {
      console.error(' Error inserting blog data:', err.message);
    }
    try {
  for (let comment of comments) {
    
    const exists = await Comment.findOne({ postId: comment.postId, content: comment.content });
    if (!exists) {
      await Comment.create(comment);
      console.log(` Comment by "${comment.author}" inserted.`);
    }
  }
} catch (err) {
  console.error(' Error inserting comment data:', err.message);
}


    app.listen(3000, () => {
      console.log(` Server running on this at http://localhost:3000`);
    });
  })
  .catch(err => console.error(' MongoDB connection error:', err));
