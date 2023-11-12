const mongoose = require('mongoose');
const User = require('./User.schema'); // Import the User model

// a schema for the Blog model
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  blogId:{
    type: Number,
    unique: true,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  //add hidden 
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
