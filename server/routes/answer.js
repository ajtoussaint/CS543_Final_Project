const express = require('express');
const router = express.Router();

const Answer = require("../models/Answer.model");

router.get("/answer/create",  async (req, res) => {
    console.log("GET request to /answer/create");
    if(!req.user){
        console.log("You are not logged in!");
    }
    //check that the user has authority to create answers for this question
        //TODO
    
    const newAnswer = new Answer({
        //answer id created automatically
        content: ""
        //set the question id
    })

    newAnswer.save()
        .then(() => {
            console.log("new answer created!");
            return res.status(200).json(newAnswer);
        })
        .catch(err => {
            console.error("Error creating answer: ", err);
            return res.sendStatus(500);
        })

    
});

router.post("/answer/delete", async (req, res) => {
    console.log("POST request to /answer/delete", req.body);
    if(!req.user){
        console.log("You are not logged in!");
    }
    //check that the user has authority to delete answers for this question
        //TODO
    try{
        const result = await Answer.findByIdAndDelete(req.body.id)
        if(result){
            console.log("Deleted successfully", result);
        }else{
            console.log("Object to delete could not be found");
            res.sendStatus(404);
        }
        return res.sendStatus(200);
    } catch(err){
        console.error(err);
        return res.sendStatus(500);
    }
});

router.post("/answer/update", async (req, res) => {
    console.log("POST request to /answer/update", req.body);

    const { _id, content, questionId } = req.body;

    if(!req.user){
        console.log("You are not logged in!");
    }
    //check that the user has authority to delete answers for this question
        //TODO
    try{
        const updatedAnswer = await Answer.findById(_id);

        if(!updatedAnswer)
            return res.sendStatus(404);

        updatedAnswer.content = content;

        if(questionId)
            updatedAnswer.questionId = questionId;

        updatedAnswer.save()
        .then(() => {
            console.log("update performed", updatedAnswer);
            return res.status(200).json(updatedAnswer);
        })
        .catch(err => {
            console.error("Error updating answer: ", err);
            return res.sendStatus(500);
        })
    }catch(err){
        console.error(err);
        return res.sendStatus(500);
    }
});

module.exports = router;