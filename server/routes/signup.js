const express = require('express');
const router = express.Router();

router.post('/signup', async (req, res) => {
    console.log("POST request to /signup");
    const { username, password } = req.body;
    console.log(username, password);
    res.status(200).json({username: username});
})

module.exports = router;