const express = require('express');
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt');
const User = require('../models/User.schema');
const { AuthenticateUser } = require("../authenticate");

const router = express.Router();


// User registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password /*:hashedPassword */});
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/getall', async(req, res)=>{
    try {
        const users = await User.find(); // Fetch all users from the database
        res.json(users); // Return the list of users as a JSON response
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
      }
});

// User login endpoint
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
      res.json({ token, userId: user._id, role: user.role });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });
  
// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user || password/*!(await bcrypt.compare(password, user.password))*/) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
//     res.json({ token, userId: user._id, role: user.role });
//   } catch (error) {
//     res.status(500).json({ error: 'Login failed' });
//   }
// });

  // Apply the authMiddleware to routes you want to protect
  router.get('/profile', AuthenticateUser, async (req, res) => {
    try {
      const username = req.body.username;
      const user = await User.findOne({ username: username });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Remove sensitive information (e.g., password) from the user object before sending it in the response
      const userProfile = {
        username: user.username,
        email: user.email,
        role: user.role,
        // Add any other profile information you want to include
      };
  
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve user profile' });
    }
  });
  
  router.put('/profile', AuthenticateUser, async (req, res) => {
    const userId = req.userId;
    // Update user information based on userId
    // Send the updated user information in the response
  });

// User profile retrieval and update endpoints
// Add authentication middleware here to protect these routes

module.exports = router;
