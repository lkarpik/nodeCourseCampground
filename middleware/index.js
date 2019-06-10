const Comment = require("../models/comment.js");
const Campground = require("../models/campground.js");

let middlewareObj = {};

middlewareObj.checkCommentOwnershp = function (req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }
            }
        });
        } else {
            req.flash("error", "You have to be logged in");
            res.redirect("back");
    }
};

middlewareObj.checkCampgroundOwner = function  (req, res, next) {
    // is logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, result) => {
            if(err){
                console.log(err);
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                // does user own camp
                // console.log(result.author.id, req.user._id , res.locals.currentUser._id);
                // console.log(typeof result.author.id, typeof req.user._id , typeof res.locals.currentUser._id);
                // if(JSON.stringify(result.author.id) === JSON.stringify(req.user._id)){
                if(result.author.id.equals(req.user._id)){
                   next();
                } else {
                    req.flash("error", "You dont have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You have to be logged in");
        res.redirect("back");
    }
    
    // if not redirect
};

middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please log in first");
    
    res.redirect("/login");
};

module.exports = middlewareObj;