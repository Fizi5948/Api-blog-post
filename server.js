require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fs = require('fs').promises;
const Post = require('./Models/Post');
const postRoutes = require('./routes/postRoutes');
const auth = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/posts', postRoutes);
app.use('/api/_id',postRoutes)
app.use('/api/auth/login', auth);


mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log(' MongoDB connected');

    try {
      const count = await Post.countDocuments();
      if (count === 0) {
        const rawData = await fs.readFile('./data.json', 'utf-8');
        const jsonData = JSON.parse(rawData);

      
        const postData = jsonData.filter(item => item.title && item.content);

        await Post.insertMany(postData);
        
        console.log(' Blog post data inserted');
      }
    } catch (err) {
      console.error(' Error inserting seed data:', err);
    }

   app.listen(3000, ()=> {
    console.log(`App Listhening at http://localhost:3000`   )
 })
  })
  .catch(err => console.error('MongoDB connection error:', err));
