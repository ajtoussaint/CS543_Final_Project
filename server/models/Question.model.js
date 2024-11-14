const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: String,
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    tags: String,
    //array of media //relate to media schema similar to answers
    answers: [{
        answerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer",
            required:true
        },
        order: {
            type: Number,
            required:true,
        }
    }],
    correctAnswerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer"
    }
})

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;