const express = require('express');
const router = express.Router();

const Answer = require("../models/Answer.model");
const Question = require("../models/Question.model");

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

router.get("/answer/:id", async (req, res) => {
    const { id } = req.params;
    console.log("GET request to /answer/" + id);

    try{
        const answer = await Answer.findById(id);
        if(answer){
            //console.log("Found answer to send: ", answer)
            res.status(200).json(answer);
        }else{  
            res.sendStatus(404);
        }
    }catch(err){
        console.error(err);
        res.sendStatus(500);
    }
})

router.post("/answer/delete", async (req, res) => {
    console.log("POST request to /answer/delete", req.body);
    if(!req.user){
        console.log("You are not logged in!");
        return res.status(401).json({message: "You are not logged in"});
    }

    const ans = await Answer.findById(req.body.id);
    const q = await Question.findById(ans.questionId);

    if(q && !q.creatorId.equals(req.user._id)){
        console.log("User unauthorized to delete");
        return res.status(401).json({message:"You can only delete answers you have created"});
    }
    
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
            //console.log("update performed", updatedAnswer);
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