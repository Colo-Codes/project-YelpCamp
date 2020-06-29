// Initializing express and importing packages
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    flash = require('connect-flash'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds'),
    methodOverride = require('method-override');

// Routes (after refactoring)
const commentsRoutes = require('./routes/comments'),
    campgroundsRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

// Using flash messages
app.use(flash()); // This needs to come before the passport usage in order to work properly.

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
console.log('Database URL: ' + process.env.DATABASEURL);
//mongoose.connect('mongodb://localhost/yelp_camp_db'); // This is for the local MongoDB
//mongoose.connect('mongodb+srv://darthcolo:Password123!@cluster0-6ykft.mongodb.net/yelp_camp_db?retryWrites=true&w=majority'); // This is for the cloud MongoDB Atlas
const url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp_db'; // Just in case the environment variable is destroyed or does not exists.
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
// Use "ejs" as view engine (so you don't have to write ".ejs" for file extensions):
app.set('view engine', 'ejs');

// Referencing the public directory (for CSS and JavaScript files). This is needed to reference the CSS file in other files.
app.use(express.static(__dirname + '/public')); // The __dirname is the full directory path (it is used like this conventionally).

// This is a middleware - Sending user information to the header.ejs file, to be available on all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user; // Anything that we put in the res.locals will be available in the templates.
    res.locals.error = req.flash('error'); // This will enable the possibility to display flash messages in all pages.
    res.locals.success = req.flash('success'); // This will enable the possibility to display flash messages in all pages.
    next();
});

// Overriding routes to edit campgrounds
app.use(methodOverride('_method')); // Convention

// Routes (start) ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// All routes are imported.
app.use('/', indexRoutes);
app.use('/campgrounds/', campgroundsRoutes);
app.use('/campgrounds/:id/comments', commentsRoutes);
// Routes (end) ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Running Node.js server, the Heroku way (!)
app.listen(process.env.PORT || '3000', () => {
    console.log('YelpCamp server running... (local port 3000)');
});
// app.listen('3000', () => {
//     console.log('YelpCamp server running... (port 3000)');
// });