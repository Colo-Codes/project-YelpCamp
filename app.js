// Initializing express
const express = require('express');
const app = express();
// Use "ejs" as view engine (so you don't have to write ".ejs" for file extensions):
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    // res.send('YelpCamp: It Works!');
    res.render('landing');
});
app.get('/campgrounds', (req, res) => {
    const campgrounds = [
        {name: 'Unley Creek', image: 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'},
        {name: 'Norwood Forest', image: 'https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1088&q=80'},
        {name: 'Glenelg Valley', image: 'https://images.unsplash.com/photo-1548062005-e50d06091399?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1252&q=80'}
    ];
    res.render('campgrounds', {campgroundsPage:campgrounds});
});

// Running Node.js server
app.listen('3000', () => {
    console.log('YelpCamp server running... (port 3000)');
    
});