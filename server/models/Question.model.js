const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: String,
    creatorid: String, //relate to user schema
    tags: String,
    //array of media //relate to media schema
    //array of answers //relate to anwer schema
    correctAnswerId:String
})

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;