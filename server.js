require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const Post = require('./Models/Post');
const postRoutes = require('./routes/postRoutes');
const auth = require('./routes/auth');
const commentRoutes = require('./routes/comments');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/posts', postRoutes);
app.use('/api/_id',postRoutes)
app.use('/api/auth/login', auth);
app.use('/api/comments', commentRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log(' MongoDB connected');

   

   app.listen(3000, ()=> {
    console.log(`App Listhening at http://localhost:3000`   )
 })
  })
  .catch(err => console.error('MongoDB connection error:', err));
