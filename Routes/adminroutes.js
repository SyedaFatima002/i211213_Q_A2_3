const express = require('express');
const router = express.Router();
const { AuthenticateAdmin } = require('../authenticateadmin');
const Blog = require('../models/blog.schema');
const User = require('../models/User.schema');

router.post('/login', async(req, res)=>{
    try {
    const { username, password } = req.body;
    if (username!="admin" || password!=1234) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username: "admin", role: "admin" }, process.env.SECRET_KEY , { expiresIn: '24h' });
    res.json({ token, username: "admin", role: "admin" });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
})

// Create a user by admin
router.post('/createuser', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const newUser = new User({ username, email, password, role });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Delete a user by admin
router.delete('/deleteusers/:username',  async (req, res) => {
  try {
    const userId = req.params.username;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Create a blog by admin
router.post('/createblogs', async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    const newBlog = new Blog({ title, content, author: authorId });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating blog' });
  }
});

// Delete a blog by admin
router.delete('/admin/blogs/:blogId', async (req, res) => {
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


// View all users by admin
router.get('/viewusers', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  });
  
  // View a particular user by admin
  router.get('/viewuser/:username',  async (req, res) => {
    try {
      const userId = req.params.username;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching user' });
    }
  });
  
  // View all blogs by admin
  router.get('/viewblogs', async (req, res) => {
    try {
      const blogs = await Blog.find().populate('author', 'username');
      res.status(200).json(blogs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching blogs' });
    }
  });
  
  // View a particular blog by admin
  router.get('/viewblog/:blogId', async (req, res) => {
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
  


module.exports = router;
