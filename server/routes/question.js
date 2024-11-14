const express = require('express');
const router = express.Router();

const Question = require("../models/Question.model");

//create a new question from saving on the edit page
router.post("/question/create", async (req, res) => {
    console.log("POST request to /question/create");

    const { title, tags, answers, correctAnswerId } = req.body;

    if (!req.user) {
        console.log("You are not logged in!");
    } else {
        let answerMap = answers.map((a, index) => {
            return { answerId: a._id, order: (index + 1) }
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
});

//return the information about a question
router.get("/question/:id", async (req, res) => {
    const { id } = req.params;
    console.log("GET request to /question/" + id);

    try {
        const question = await Question.findById(id);
        if (question) {
            //console.log("Found question to send: ", question);
            res.status(200).json(question);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

//update a question from saving on the edit page
router.post("/question/update", async (req, res) => {
    console.log("POST request to /question/update", req.body);
    const id = req.body._id;
    try {
        const question = await Question.findById(id);
        if (question) {
            console.log("Found question to update: ", question);
            //update question based on request
            ["title", "tags", "correctAnswerId"].forEach(k => {
                question[k] = req.body[k];
            });

            //update the questions answers
            question.answers = req.body.answers.map((ans, i) => ({ answerId: ans._id, order: i }))
            console.log("Answer references updated in question: ", question.answers);
            //save and return question
            question.save()
                .then(() => {
                    console.log("Question updated successfully: ", question);
                    return res.status(200).json(question);
                }).catch(err => {
                    console.error("Error updating question: ", err);
                    return res.sendStatus(500);
                })
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }

})


// Get all questions
router.get("/questions", async (req, res) => {
    console.log("GET request to /questions");

    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (err) {
        console.error("Error fetching questions: ", err);
        res.sendStatus(500);
    }
});

module.exports = router;