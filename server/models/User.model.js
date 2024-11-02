const mongoose = require('mongoose');

//define a mongoose schema
const userSchema = new mongoose.Schema({
    username: String,
    hashedPassword: String
  });
  
const User = mongoose.model('User', userSchema);

module.exports = User;