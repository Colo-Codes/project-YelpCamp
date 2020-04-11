// Initializing express and importing packages
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
// Use "ejs" as view engine (so you don't have to write ".ejs" for file extensions):
app.set('view engine', 'ejs');

// Array that will later be moved into a database
const campgrounds = [
    {name: 'Unley Creek', image: 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'},
    {name: 'Norwood Forest', image: 'https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1088&q=80'},
    {name: 'Glenelg Valley', image: 'https://images.unsplash.com/photo-1548062005-e50d06091399?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1252&q=80'}
];

// Routes
app.get('/', (req, res) => {
    // res.send('YelpCamp: It Works!');
    res.render('landing');
});
app.get('/campgrounds', (req, res) => { // Using RESTful convention
    res.render('campgrounds', {campgroundsPage:campgrounds});
});
app.post('/campgrounds', (req, res) => { // Using RESTful convention
    // res.send('Posted!');
    const campgroundName = req.body.campgroundName;
    const campgroundImage = req.body.campgroundImage;
    const newCampGround = {name: campgroundName, image: campgroundImage};
    campgrounds.push(newCampGround);
    res.redirect('/campgrounds'); // Default redirection is as GET request
});
app.get('/campgrounds/new', (req, res) => { // Using RESTful convention
    // res.send('Create a new camp!');
    res.render('newcampground');
});

// Running Node.js server
app.listen('3000', () => {
    console.log('YelpCamp server running... (port 3000)');
    
});