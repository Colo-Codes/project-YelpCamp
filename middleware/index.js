// Middleware goes here.
const Comment = require('../models/comment'),
    Campground = require('../models/campground');

const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err){
                req.flash('error', 'Campground not found.'); // This will be shown on the next page the user is redirected to. This is why it needs to be before the redirect.
                res.redirect('back'); // This redirect the user to the previous page he/she was on.
            } else {
                // We could compare foundCampground.author.id with req.user._id using '===', but the former is an object and the later is a string.
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'You don\'t have permission to do that.'); // This will be shown on the next page the user is redirected to. This is why it needs to be before the redirect.
                    res.redirect('back'); // This redirect the user to the previous page he/she was on.
                }
            }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that.'); // This will be shown on the next page the user is redirected to. This is why it needs to be before the redirect.
        res.redirect('back'); // This redirect the user to the previous page he/she was on.
    }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if(err){
                    req.flash('error', 'Comment not found.'); // This will be shown on the next page the user is redirected to. This is why it needs to be before the redirect.
                    res.redirect('back'); // This redirect the user to the previous page he/she was on.
                } else {
                    // We could compare foundComment.author.id with req.user._id using '===', but the former is an object and the later is a string.
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash('error', 'You don\'t have permission to do that.'); // This will be shown on the next page the user is redirected to. This is why it needs to be before the redirect.
                        res.redirect('back'); // This redirect the user to the previous page he/she was on.
                    }
                }
            });
        } else {
            req.flash('error', 'You need to be logged in to do that.'); // This will be shown on the next page the user is redirected to. This is why it needs to be before the redirect.
            res.redirect('back'); // This redirect the user to the previous page he/she was on.
        }
};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next(); // Move on to render the new comment or campground.
    }
    req.flash('error', 'You need to be logged in to do that.'); // This will be shown on the next page the user is redirected to. This is why it needs to be before the redirect.
    res.redirect('/login');
};

module.exports = middlewareObj;