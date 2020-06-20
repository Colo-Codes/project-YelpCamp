const express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    Comment = require('../models/comment');

// ***** RESTful: INDEX route (GET, show all items)
// /campgrounds
router.get('/', (req, res) => { // Using RESTful convention
    // Get all campgrounds from DB
    Campground.find(
        {}, function(err, campgrounds){
            if(err) {
                console.log('Error! ' + err);
            } else {
                console.log('Found campgrounds! ' + campgrounds);
                res.render('campgrounds/index', {campgroundsPage:campgrounds}); // Sending campground information to webpages.
            }
    });
    // Using arrays: res.render('campgrounds', {campgroundsPage:campgrounds});
});
// ***** RESTful: NEW route (GET, show creation form)
// /campgrounds/new
router.get('/new', isLoggedIn, (req, res) => { // Using RESTful convention
    // res.send('Create a new camp!');
    res.render('campgrounds/new');
});
// ***** RESTful: CREATE route (POST, create an item)
// /campgrounds
router.post('/', isLoggedIn, (req, res) => { // Using RESTful convention
    // res.send('Posted!');
    const campgroundName = req.body.campgroundName;
    const campgroundImage = req.body.campgroundImage;
    const campgroundDescription = req.body.campgroundDescription;
    const campgroundAuthor = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampGround = {name: campgroundName, image: campgroundImage, description: campgroundDescription, author: campgroundAuthor};
    // If using arrays: campgrounds.push(newCampGround);
    // Add a new campground to the DB
    Campground.create(newCampGround, function(err, newlyCreated){
        if(err) {
            console.log('Error trying to add a campground to DB! ' + err);
        } else {
            // Redirect to campgrounds page
            res.redirect('/campgrounds'); // Default redirection is as GET request
        }
    });
});
// ***** RESTful: SHOW route (GET, show item by id)
// /campgrounds/:id
router.get('/:id', (req, res) => { // Using RESTful convention
    // res.send('This will be the SHOW page in the future...');
    // Find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err) {
            console.log('Error trying to find a campground in the DB! ' + err);
        } else {
            console.log(foundCampground); // REMEMBER: if there is only one comment, it will display only the ID, but is actually working OK.
            // Render the SHOW template with a campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// Middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next(); // Move on to render the new comment or campground.
    }
    res.redirect('/login');
};

module.exports = router;