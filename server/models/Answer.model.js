const mongoose = require('mongoose');

//define a mongoose schema
const answerSchema = new mongoose.Schema({
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    content: String,
  });
  
const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;