//TODO: React Router

const express = require('express');//server util
const mongoose = require('mongoose');//database util
const signup = require('./routes/signup.js');
const login = require('./routes/login.js');
const answer = require('./routes/answer.js');
const question = require('./routes/question.js');
const media = require('./routes/media.js');
const file = require("./routes/file.js");

const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

//CORS
const client_url = process.env.CLIENT || "http://localhost:3000";

//cors setup for communication with front-end
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', client_url);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
})

app.use(cors({origin: client_url }));

//Database connection
const DATABASE_NAME = process.env.DATABASE_NAME || "mydb";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/" + DATABASE_NAME;

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));


//Passport setup and login/logout routes
login(app, MONGO_URI); //syntax is different because some app.use is applied

//Routes
app.use('/api', signup);
app.use('/api', answer);
app.use('/api', question);
app.use('/api', media);
app.use('/api',file);


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
