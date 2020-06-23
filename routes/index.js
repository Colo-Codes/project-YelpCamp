const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

router.get('/', (req, res) => {
    // res.send('YelpCamp: It Works!');
    res.render('landing');
});

// Auth Routes (start) +++++++++++++++++
// -    User Registration - Show register form
router.get('/register', (req, res) => {
    res.render('register');
});
// -    User Registration - Handle Sing Up logic
router.post('/register', (req, res) => {
    //res.send('Signing you up...');
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => { // Instead of saving the raw passport to the database, it will sote the hashed password.
        if(err){
            req.flash('error', 'Something went wrong: ' + err.message); // This will be shown on the next page the user is redirected to. This is why it needs to be before the redirect.
            console.log(err);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'Successfully registered as: ' + user.username); // This will be shown on the next page the user is redirected to. This is why it needs to be before the redirect.
            res.redirect('/campgrounds');
        });
    });
});
// -    User Login - Show login form
router.get('/login', (req, res) => {
    res.render('login');
});
// -    User Login - Handle login logic
// app.post('/login', middleware, callback)
router.post('/login', passport.authenticate('local', // The user is presumed to exist.
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), (req, res) => {

});
// -    User Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out.');
    res.redirect('/campgrounds');
});
// Auth Routes (end) +++++++++++++++++++

module.exports = router;