const express = require('express');
const router = express.Router();

const Question = require("../models/Question.model");
const Tag = require("../models/Tag.model");

//create a new question from saving on the edit page
router.post("/question/create", async (req, res) => {
    console.log("POST request to /question/create");

    const { title, tags, answers, media, correctAnswerId } = req.body;

    if (!req.user || !req.isAuthenticated()) {
        console.log("You are not logged in!");
        return res.status(401).json({message: "User is not logged in"});
    } else {
        //convert list of answers to FKs
        let answerMap = answers.map((a, index) => {
            return { answerId: a._id, order: (index) }
        })

        let mediaMap = media.map((m, index) => {
            return {mediaId: m._id, order:(index)}
        })

        tagifyString(tags).then( (dbTags) => {
            //dbTags is an array of tag objects from the database
            qTags = dbTags.map(t => {
                return {tagId: t._id}
            });

            const question = new Question({
                title: title,
                creatorId: req.user._id,
                tags: qTags,
                answers: answerMap,
                media: mediaMap,
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
        })

        //only create questions if authenticated
        
    }
});

//return the information about a question
router.get("/question/:id", async (req, res) => {
    const { id } = req.params;
    console.log("GET request to /question/" + id);

    try {
        const question = await Question.findById(id);
        if (question) {
            //coalesce tag documents into a string  before returning the question
            const response = {
                ...question.toObject(), 
                tags: await stringifyTags(question.tags) // Replace the tags property with the string
            };
            res.status(200).json(response);
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
    if (!req.user || !req.isAuthenticated()) {
        console.log("You are not logged in!");
        res.status(401).json({message: "User is not logged in"});
    }else{
        try {
            const question = await Question.findById(id);
            if (question) {
                console.log("Found question to update: ", question);
                //check if user is authorized
                if(question.creatorId !== req.user._id){
                    console.log("User unauthorized to update question");
                    return res.status(401).json({message:"You can only update questions you have created"});
                }
                //convert list of tags to new docs, create if not existing
                let tags = await tagifyString(req.body.tags)
                
                question.tags = tags.map(t => {
                    return {tagId: t._id}
                });
    
                console.log("Updated tags to be:", question.tags);
                //update question based on request
                ["title", "correctAnswerId"].forEach(k => {
                    question[k] = req.body[k];
                });
    
                //update the questions answers
                question.answers = req.body.answers.map((ans, i) => ({ answerId: ans._id, order: i }))
                question.media = req.body.media.map((m, i) => ({ mediaId: m._id, order: i }))
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
    
    }
    
});

async function tagifyString(tags){
    //convert list of tags to new docs, create if not existing
    tagList = tags.split(",").map(x =>x.trim().toLowerCase());

    return Promise.all(
        tagList.map(async (tname) =>{
            try{
                let tag = await Tag.findOne({name: tname});
                if(!tag){
                    //create a new Tag
                    console.log("Creating new tag for: ", tname);
                    tag = new Tag({name:tname});
                    await tag.save();
                }
                return tag;
            }catch(err){
                console.error("Problem finding/creating tags by name", err);
                return null;
            }
        })
    )
};

async function stringifyTags(tags){
    //tags is array of objects with tagId attr
    return Promise.all(
        tags.map(async (t) => {
            try{
                let tag = await Tag.findById(t.tagId);
                return tag.name;
            }catch(err){
                console.error("Problem finding tag names for output", err);
            }
        })
    ).then(tagNames => {
        // Filter out null values and join the names
        return tagNames.filter(name => name !== null).join(', ');
    });
}


// Get all questions
router.get("/questions", async (req, res) => {
    console.log("GET request to /questions");
    try {
        const questions = await Question.find();
        // coalesce tag documents into a string  before returning the question
        Promise.all(questions.map(async q => {
            const r = {
                ...q.toObject(), 
                tags: await stringifyTags(q.tags) // Replace the tags property with the string
            };
            return r;
        })).then(qs => {
            console.log("Responding with: ", qs);
            res.status(200).json(qs);
        })
    } catch (err) {
        console.error("Error fetching questions: ", err);
        res.sendStatus(500);
    }
});

module.exports = router;