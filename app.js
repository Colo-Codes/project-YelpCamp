// Initializing express and importing packages
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    seedDB = require('./seeds');

// Seeding the DB
seedDB();

// Connecting to mongodb DB through mongoose
mongoose.connect('mongodb://localhost/yelp_camp_db');

app.use(bodyParser.urlencoded({extended: true}));
// Use "ejs" as view engine (so you don't have to write ".ejs" for file extensions):
app.set('view engine', 'ejs');

// Routes (start) ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get('/', (req, res) => {
    // res.send('YelpCamp: It Works!');
    res.render('landing');
});
// ***** RESTful: INDEX route (GET, show all items)
app.get('/campgrounds', (req, res) => { // Using RESTful convention
    // Get all campgrounds from DB
    Campground.find(
        {}, function(err, campgrounds){
            if(err) {
                console.log('Error! ' + err);
            } else {
                console.log('Found campgrounds! ' + campgrounds);
                res.render('index', {campgroundsPage:campgrounds});
            }
    });

    
    // Using arrays: res.render('campgrounds', {campgroundsPage:campgrounds});
});
// ***** RESTful: NEW route (GET, show creation form)
app.get('/campgrounds/new', (req, res) => { // Using RESTful convention
    // res.send('Create a new camp!');
    res.render('newcampground');
});
// ***** RESTful: CREATE route (POST, create an item)
app.post('/campgrounds', (req, res) => { // Using RESTful convention
    // res.send('Posted!');
    const campgroundName = req.body.campgroundName;
    const campgroundImage = req.body.campgroundImage;
    const campgroundDescription = req.body.campgroundDescription;
    const newCampGround = {name: campgroundName, image: campgroundImage, description: campgroundDescription};
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
app.get('/campgrounds/:id', (req, res) => { // Using RESTful convention
    // res.send('This will be the SHOW page in the future...');
    // Find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err) {
            console.log('Error trying to find a campground in the DB! ' + err);
        } else {
            console.log(foundCampground); // REMEMBER: if there is only one comment, it will display only the ID, but is actually working OK.
            // Render the SHOW template with a campground
            res.render('show', {campground: foundCampground});
        }
    });
});

// Routes (end) ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Running Node.js server
app.listen('3000', () => {
    console.log('YelpCamp server running... (port 3000)');
    
});