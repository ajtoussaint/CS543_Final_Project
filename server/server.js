//TODO: React Router

const express = require('express');//server util
const mongoose = require('mongoose');//database util
const testRouter = require('./routes/routerTest.js');
const testDatabase = require('./routes/dataTest.js');
const signup = require('./routes/signup.js');
const login = require('./routes/login.js');

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

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

//passport setup to login users and maintain sessions
const User = require('./models/User.model.js');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');

const MongoStore = require('connect-mongo');
const session = require('express-session');

app.use(session({
    secret: process.env.SESSION_SECRET || "TODO: change me",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: MONGO_URI})
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user,done) =>{
    done(null,{_id:user._id});
});

passport.deserializeUser(async (id,done) => {
    try{
        const user = await User.findById(id._id);
        done(null,user);
    }catch(err){
        console.log("Error deserializing");
        done(err);
    }
});

passport.use(new LocalStrategy(
    async (username, password, done) => {
        console.log("Logging in " + username + " using local strat");
        try{
            const user = await User.findOne({username:username});
            let passwordCorrect = await bcrypt.compareSync(password, user.hashedPassword)
            
            if(!user){
                console.log("Attempted login to nonexistnat user")
                return done(null, false);//return all data stored in the user object
            }else if(!passwordCorrect){
                console.log("Attempt to login with wrong password");
                return done(null, false);//wrong password
            }else{
                console.log("Successful login!");
                return done(null,user);
            }

        }catch (err){
            console.error("Problem connecting to dabase during local strat");
            return done(null, false);
        }
    }
));

app.post('/api/login', passport.authenticate('local'), (req, res) => {
    console.log("POST request to /login")//debug
    req.session.user = req.user.username;
    res.status(200).json({user: req.user});
}); 

app.get('/api/logout', (req, res) => {
    console.log("GET request to /logout");
    req.logout( err => {
        if(err){
            console.error("Problem logging out ", err);
        }else{
            res.json({message: "Logout successful!"});
        }
    })
})

//Routes
app.use('/api', testRouter);
app.use('/api', testDatabase);
app.use('/api', signup);
app.use('/api', login);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
