var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cat_app');

// Define how a cat object (a pattern for our data) should look like
var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});
// Now we compile the schema into a model and we save it into a variable Cat
var Cat = mongoose.model('Cat', catSchema); // We can use the variable Cat to find cats, update them, remove them, etc.
//                         ^ This 'Cat' is the singular version of the collection name (the collection will be 'Cats').

// New cat
var george = new Cat({
    name: 'George',
    age: 11,
    temperament: 'Mad'
});
// Save the new cat to the DB (we use a callback function because the interaction betwee JS and MongoDB takes time)
george.save(function(err, cat){
    if(err) {
        console.log('Something went wrong!');
    } else {
        console.log('Cat saved to the DB: ' + cat);
        
    }
});


// Adding a new cat to the DB



// Retrieve all cats from the DB