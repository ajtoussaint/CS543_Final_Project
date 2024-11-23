const express = require('express');
const router = express.Router();

const Media = require("../models/Media.model");

router.post("/media/create", async (req, res) => {
    console.log("POST request to media/create", req.body);
    if(!req.user){
        console.log("You are not logged in!");
        return res.status(401).json({message: "You are not logged in"});
    }
    const newMedia = new Media({
        ...req.body, creatorId: req.user._id
    })

    newMedia.save()
        .then(() => {
            console.log("new Media was created!");
            return res.status(200).json(newMedia);
        })
        .catch(err => {
            console.error("Error creating Media: ", err);
            return res.sendStatus(500);
        })
})

router.get("/media/:id", async (req, res) => {
    const { id } = req.params;
    console.log("GET request to media/" + id);
    try{
        const media = await Media.findById(id);
        if(media){
            res.status(200).json(media);
        }else{
            res.sendStatus(404);
        }
    }catch(err){
        console.error(err);
        res.sendStatus(500);
    }
})

router.post("/media/delete", async (req, res) => {
    console.log("POST request to /media/delete", req.body);
    if(!req.user){
        console.log("Not logged in");
        return res.status(401).json({message: "You are not logged in"});
    }

    try{
        const result = await Media.findByIdAndDelete(req.body.id);
        if(result && result.creatorId === req.user._id){
            console.log("Deleted good", result);
            res.sendStatus(200);
        }else{
            console.log("media to delete could not be found")
            res.sendStatus(404);
        }
    }catch(err){
        console.error(err);
        return res.sendStatus(500);
    }
})
module.exports = router;