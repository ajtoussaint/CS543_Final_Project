const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const User = require("../models/User.model");  

router.post('/signup', async (req, res) => {
    console.log("POST request to /signup");
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 9);

    //check that the username is not taken
    const existingUser = await User.findOne({username:username});

    if(existingUser){
        console.log("User already exists")
        return res.status(200).json({error:"Username already exists"});
    }

    const newUser = new User({
        username: username,
        hashedPassword: hashedPassword
    })

    newUser.save()
        .then(() => {
            console.log('User ' + username +  'created successfully');
        })
        .catch(err => {
            console.error("Error creating user: ", err);
        })
    
    return res.status(200).json({username: username});
})

module.exports = router;