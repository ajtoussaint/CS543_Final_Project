const express = require('express');
const router = express.Router();

const Answer = require("../models/Answer.model");
const Question = require("../models/Question.model");

//create a new question from saving on the edit page
router.post("/question/create", async (req, res) => {
    console.log("POST request to /question/create");

    const {title, tags, answers, correctAnswerId} = req.body;

    if(!req.user){
        console.log("You are not logged in!");
    }else{
        let answerMap = answers.map((a, index) => {
            return {answerId:a._id, order: (index+1)}
        })
        //only create questions if authenticated
        const question = new Question({
            title: title,
            creatorId: req.user._id,
            tags: tags,
            answers: answerMap,
            correctAnswerId: correctAnswerId,
        })

        question.save()
            .then(() => {
                console.log("new question created!", question);
                res.json(question);
            })
            .catch(err => {
                console.error("Error creating question: ", err);
                res.sendStatus(500);
            })
    }
})

//update a question from saving on the edit page

module.exports = router;