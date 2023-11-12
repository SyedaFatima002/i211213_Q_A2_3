const jwt = require('jsonwebtoken');
const User = require('../models/User.schema');
const Blog = require('../models/blog.schema');

// User registration endpoint
let register =  async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password, followers: [], following: []});
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
}

// User login endpoint
let Login =  async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ username: user.username, role: user.role }, process.env.SECRET_KEY , { expiresIn: '24h' });
    res.json({ token, username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
}

  // Apply the authMiddleware to routes you want to protect
let getprofile= async (req, res) => {
    try {
      const username = req.params.username;
      const user = await User.findOne({ username: username });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid user' });
      }
  
      const userProfile = {
        username: user.username,
        email: user.email,
        role: user.role,
      };
  
      return res.status(200).json(userProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching user profile' });
    }
  }

  let getfeed = async (req, res) => {
    try {
      const username = req.params.username;
      const user = await User.findOne({ username: username });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid user' });
      }
  
      let following = user.following;
      let feed = []; // Initialize feed array
  
      following.forEach(async (element) => {
        const blogs = await Blog.find({ author: element });
        feed.push(...blogs);
      });
  
      return res.status(200).json(feed);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching user profile' });
    }
  };
  
  
let updateprofile= async (req, res) => {
    try {
      const username = req.params.username;
      const user = await User.findOne({ username: username });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update user fields based on the request body
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.username) {
        user.username = req.body.username;
      }
      if (req.body.password) {
        user.password = req.body.password;
      }
  
      // Save the updated user
      const updatedUser = await user.save();
  
      // Respond with the updated user profile
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating user profile' });
    }
  }

let deleteprofile= async (req, res) => {
    try {
      const username = req.params.username;
      const user = await User.findOne({ username: username });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the authenticated user is the owner of the profile
      if (user._id.toString() !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized: You do not have permission to delete this profile' });
      }
  
      // Delete the user
      await user.remove();
  
      // Respond with a success message
      return res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting user profile' });
    }
  }

  let addfollower = async(req, res)=>{
    try {
      const { targetUsername } = req.body;
      const currentUser = await User.findById(req.params.username);
  
      // Check if the target user exists
      const targetUser = await User.findOne({ username: targetUsername });
      if (!targetUser) {
        return res.status(404).json({ error: 'Target user not found' });
      }
  
      // Check if the target user is not already in the followers list
      if (!currentUser.followers.includes(targetUsername)) {
        currentUser.followers.push(targetUsername);
        await currentUser.save();
        res.status(200).json({ message: 'Follower added successfully' });
      } else {
        res.status(400).json({ error: 'User is already a follower' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding follower' });
    }
  }

  let addfollowing = async(req, res) =>{
    try {
      const { targetUsername } = req.body;
  
      const currentUser = await User.findById(req.params.username);
  
      // Check if the target user exists
      const targetUser = await User.findOne({ username: targetUsername });
      if (!targetUser) {
        return res.status(404).json({ error: 'Target user not found' });
      }
  
      // Check if the target user is not already in the following list
      if (!currentUser.following.includes(targetUsername)) {
        currentUser.following.push(targetUsername);
        await currentUser.save();
        res.status(200).json({ message: 'Following added successfully' });
      } else {
        res.status(400).json({ error: 'User is already being followed' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding following' });
    }
  }

  let removefollower = async(req, res) =>{
    try {
      const { targetUsername } = req.body;
      const currentUser = await User.findById(req.params.username);
  
      // Check if the target user is in the followers list
      if (currentUser.followers.includes(targetUsername)) {
        currentUser.followers = currentUser.followers.filter(username => username !== targetUsername);
        await currentUser.save();
        res.status(200).json({ message: 'Follower removed successfully' });
      } else {
        res.status(400).json({ error: 'User is not a follower' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error removing follower' });
    }
  }

  let removefollowing = async (req, res) =>{
    try {
      const { targetUsername } = req.body;
      const currentUser = await User.findById(req.params.username);
  
      // Check if the target user is in the following list
      if (currentUser.following.includes(targetUsername)) {
        currentUser.following = currentUser.following.filter(username => username !== targetUsername);
        await currentUser.save();
        res.status(200).json({ message: 'Following removed successfully' });
      } else {
        res.status(400).json({ error: 'User is not being followed' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error removing following' });
    }
  }


module.exports = {
  register, 
  getprofile,
  Login, 
  updateprofile, 
  deleteprofile,
  addfollower,
  addfollowing,
  removefollower,
  removefollowing,
  getfeed
}