const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// CAMPGROUNDS INDEX
router.get('/', (req, res) =>{
    Campground.find({}, function(err, result){
        if(err){
            console.log(err);
        } else {
            res.render('./campgrounds/campgrounds', {campgrounds: result}); 
        }
    });
});

// NEW
router.get('/new', middleware.isLoggedIn, (req, res)=>{
    res.render('./campgrounds/new');
});

// CREATE
router.post('/', middleware.isLoggedIn, (req, res) => {
    
    let data = req.body;
    let author = {
        id: req.user._id,
        username: req.user.username
        };
    let newCampground = {name: data.name, img: data.img, description: data.description, price: data.price, author: author};
    
    Campground.create(newCampground, function(err, result){
        if(err){
            console.log(err);
            req.flash("error", err.message);
        } else {
            // result.author.id = req.user._id;
            // result.author.username = req.user.username;
            // result.save();
            // console.log("Added new camp:"+result);
            req.flash("success", "Campground created");
            res.redirect('/campgrounds');
        }
    });
    
});

// SHOW CAMPGROUND
router.get('/:id', (req, res)=>{
    Campground.findById(req.params.id).populate("comments").exec(function(err, result){
        if(err){
            console.log(err);
        } else {
            // console.log(result);
            res.render('./campgrounds/show', {campground: result});
        }
    });
});

// EDIT CAMPGROUND,
router.get("/:id/edit", middleware.checkCampgroundOwner, (req, res) => {
    Campground.findById(req.params.id, (err, result) => {
        if(err){
            console.log(err);
            
        } else {
            res.render("./campgrounds/edit", {campground: result});
        }
    });
});
// UPDATE CAMPGROUND

router.put("/:id", middleware.checkCampgroundOwner, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, result) => {
        if(err) {
            req.flash("error", err.message);
            res.redirect("/campgrounds/"+req.params.id);
        } else {
            req.flash("success", "Campground updated");
            res.redirect("/campgrounds/"+req.params.id);
        }
        
    });
});

// DELETE CAMPGRUND
router.delete("/:id", middleware.checkCampgroundOwner, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, result) => {
        
        if (err) {
            res.redirect("/campgrounds");
        } else {
            if(result.comments.length > 0){
                result.comments.forEach(comment =>{
                    Comment.findByIdAndRemove(comment, (err, result)=>{
                        if (err) {
                            console.log(err);
                        }
                    });
                });
            }
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;