// Initializing express and importing packages
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds');

// Passport configuration
app.use(require('express-session')({
    secret: 'Once again Rusty wins cutest dog!',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // The User.authenticate() method comes with the passportLocalMongoose package.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Seeding the DB
seedDB();

// Connecting to mongodb DB through mongoose
mongoose.connect('mongodb://localhost/yelp_camp_db');

app.use(bodyParser.urlencoded({extended: true}));
// Use "ejs" as view engine (so you don't have to write ".ejs" for file extensions):
app.set('view engine', 'ejs');

// Referencing the public directory (for CSS and JavaScript files). This is needed to reference the CSS file in other files.
app.use(express.static(__dirname + '/public')); // The __dirname is the full directory path (it is used like this conventionally).

// This is a middleware - Sending user information to the header.ejs file, to be available on all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user; // Anything that we put in the res.locals will be available in the templates.
    next();
});

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
                res.render('campgrounds/index', {campgroundsPage:campgrounds}); // Sending campground information to webpages.
            }
    });
    // Using arrays: res.render('campgrounds', {campgroundsPage:campgrounds});
});
// ***** RESTful: NEW route (GET, show creation form)
app.get('/campgrounds/new', (req, res) => { // Using RESTful convention
    // res.send('Create a new camp!');
    res.render('campgrounds/new');
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
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});
// Nested Routes (start) +++++++++++++++++
// ***** RESTful nested route: NEW route (GET, show item by id)
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
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
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => { // Using the isLoggedIn function here prevents anyone from adding a comment through a POST request.
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
// Auth Routes (start) +++++++++++++++++
// -    User Registration - Show register form
app.get('/register', (req, res) => {
    res.render('register');
});
// -    User Registration - Handle Sing Up logic
app.post('/register', (req, res) => {
    //res.send('Signing you up...');
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => { // Instead of saving the raw passport to the database, it will sote the hashed password.
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        });
    });
});
// -    User Login - Show login form
app.get('/login', (req, res) => {
    res.render('login');
});
// -    User Login - Handle login logic
// app.post('/login', middleware, callback)
app.post('/login', passport.authenticate('local', // The user is presumed to exist.
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), (req, res) => {

});
// -    User Logout
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});
// Auth Routes (end) +++++++++++++++++++
// Routes (end) ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Functions
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next(); // Move on to render the new comment or campground.
    }
    res.redirect('/login');

};

// Running Node.js server
app.listen('3000', () => {
    console.log('YelpCamp server running... (port 3000)');
    
});