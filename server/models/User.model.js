const mongoose = require('mongoose');

//define a mongoose schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String
  });
  
const User = mongoose.model('User', userSchema);

module.exports = User;