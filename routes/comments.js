const express = require("express");
const router = express.Router({mergeParams: true});

const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");


// CAMPGROUNDS -> NEW COMMENT
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id).populate("comments").exec(function(err, result){
        if(err){
            console.log(err);
        } else {
            // console.log(result);
            res.render('./comments/new', {campground: result});
        }
    });
});
    

// CAMPGROUNDS -> CREATE COMMENT
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
            req.flash("error", err.message);
        } else {
            
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    
                    console.log(err);
                    req.flash("error", err.message);
                } else {
                    // add username to comment
                    
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // console.log(comment);
                    comment.save();
                    // add comment to db and comment id to campground
                    campground.comments.push(comment);
                    // save campgrounds and pushed comment
                    campground.save();
                    req.flash("success", "Comment added");
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    });
});

// COMMENT EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnershp, (req, res) => {
        Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            // console.log(result);
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if (err) {
                    console.log(err);
                     
                } else {
                    res.render('./comments/edit', {campground: foundCampground, comment: foundComment});
                }
            });
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnershp,(req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, result) => {
        if(err) {
            req.flash("error", err.message);
            res.redirect("/campgrounds/"+req.params.id);
        } else {
            req.flash("success", "Comment edited");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnershp,(req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
       if(err){
            console.log(err);
            
       } else {
            Campground.findById(req.params.id, (err, foundCampground) => {
                if(err) {
                   console.log(err);
                } else {
                   foundCampground.comments.pull(req.params.comment_id);
                   foundCampground.save();
                }
           });
            req.flash("success", "Comment removed");
            res.redirect("/campgrounds/"+req.params.id);
        }
   });
   
});

module.exports = router;