const express = require('express'),
    router = express.Router({mergeParams: true}), // The mergeParams:true this will allow to access the ":id" defined in app.js.
    Campground = require('../models/campground'),
    Comment = require('../models/comment');

// Nested Routes (start) +++++++++++++++++
// ***** RESTful nested route: NEW route (GET, show item by id)
// /campgrounds/:id/comments/new
router.get('/new', isLoggedIn, (req, res) => {
    // res.send('This will be the Comments form.');
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log('ERROR: ' + err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});
// ***** RESTful nested route: CREATE route (GET, show item by id)
// /campgrounds/:id/comments
router.post('/', isLoggedIn, (req, res) => { // Using the isLoggedIn function here prevents anyone from adding a comment through a POST request.
    // res.send('This will be the Comments creation route.');
    // Lookup campground using id
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log('ERROR: ' + err);
            res.redirect('/campgrounds');
        } else {
            // Create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log('ERROR: ' + err);
                } else {
                    // Connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //Redirect to campground show page
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});
// Nested Routes (end) +++++++++++++++++

// Middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next(); // Move on to render the new comment or campground.
    }
    res.redirect('/login');
};

module.exports = router;