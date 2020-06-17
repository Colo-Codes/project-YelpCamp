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

// Routes (after refactoring)
const commentsRoutes = require('./routes/comments'),
    campgroundsRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');


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
// seedDB();

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
// All routes are imported.
app.use('/', indexRoutes);
app.use('/campgrounds/', campgroundsRoutes);
app.use('/campgrounds/:id/comments', commentsRoutes);
// Routes (end) ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Running Node.js server
app.listen('3000', () => {
    console.log('YelpCamp server running... (port 3000)');
});