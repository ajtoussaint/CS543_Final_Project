const express = require('express');
const router = express.Router();

const User = require("../models/User.model");  

router.get('/data', async (req, res) => {
    const users = await User.findOne()
    res.json(users);
})

module.exports = router;