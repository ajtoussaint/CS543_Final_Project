const User = require("../models/User.model");

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');

const MongoStore = require('connect-mongo');
const session = require('express-session');

module.exports = function(app,  MONGO_URI){
    //passport setup to login users and maintain session
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

    app.get("/api/user", (req, res) => {
        if(req.isAuthenticated()){
            res.json(req.user);
        }else{
            res.status(401).json({message: 'Not logged in'});
        }
    })
}