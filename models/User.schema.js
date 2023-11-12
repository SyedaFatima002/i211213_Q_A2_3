const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  //userid:{ type: Number, unique: true, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  followers: [{ type: String }], // Array of strings for followers
  following: [{ type: String }], // Array of strings for following
});

const User = mongoose.model('User', userSchema);

module.exports = User;
