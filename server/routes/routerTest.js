const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
    res.json({
        test: "if you can see this server is working"
    })
})

module.exports = router;