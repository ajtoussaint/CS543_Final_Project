const mongoose = require('mongoose');

//define a mongoose schema
const answerSchema = new mongoose.Schema({
    //questionId: String, //reference question schema
    content: String,
  });
  
const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;