const express = require("express");
const router = express.Router();
const passport= require("passport");

const Campground = require("../models/campground");
const Comment = require("../models/comment");
const User = require("../models/user");

//HOME 
router.get('/', function(req, res){
    res.render('landing');
});


// ===========
// AUTH ROUTES

// register
router.get('/register', (req, res) => {
    res.render("register");
});
// create user
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "You are logged in as: " + user.username);
                
                res.redirect("/campgrounds");
            });
            
        }
        
    });
});

// login form
router.get("/login", (req, res) => {
    res.render("login");
});

// login
router.post("/login", passport.authenticate("local", 
            {
                successRedirect: "/campgrounds",
                failureRedirect: "/login",
                failureFlash: true,
                successFlash: "Succesfully logged in"
            }), (req, res) => {
});


// logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("info", "You are logged out");
    res.redirect("/campgrounds");
});

// middleware


module.exports = router;