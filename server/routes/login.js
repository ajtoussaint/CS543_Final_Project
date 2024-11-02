const express = require('express');
const router = express.Router();

router.get('/user', (req, res) => {
    if(req.isAuthenticated()){
        res.json(req.user);
    }else{
        res.status(401).json({message: 'Not logged in'});
    }
})

module.exports = router;