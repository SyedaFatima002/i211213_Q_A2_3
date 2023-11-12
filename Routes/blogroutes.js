const express = require('express');
const router = express.Router();
const { AuthenticateUser } = require('../authenticate');
const Blog = require('../models/blog.schema'); 
const User = require('../models/User.schema'); 

// Create a blog
router.post('/createblog', async (req, res) => {
  try {
    const { title, content, blogId } = req.body;
    const username = req.username; 

    const newBlog = new Blog({
      title,
      content,
      blogId,
      author: username,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating blog' });
  }
});

// Get all blogs
router.get('/all', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username'); // Assuming author is a reference to the User model
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching blogs' });
  }
});

// Get a specific blog
router.get('/get/:blogId', async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const blog = await Blog.findById(blogId).populate('author', 'username');
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching blog' });
  }
});

//Get all blogs of a specific user
router.get('/get/:username', async(req, res)=>{
  try {
    const user = req.params.username;
    const blogs = await Blog.find({author:user});
    if (!blogs) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching blog' });
  }
})

// Update a blog
router.put('/updateblog/:blogId', async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { title, content } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, content, updatedAt: Date.now() },
      { new: true } // Return the updated document
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating blog' });
  }
});

// Delete a blog
router.delete('/delete/:blogId', async (req, res) => {
  try {
    const blogId = req.params.blogId;

    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting blog' });
  }
});

module.exports = router;
