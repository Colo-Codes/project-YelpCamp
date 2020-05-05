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

// // New cat
// var george = new Cat({
//     name: 'George',
//     age: 11,
//     temperament: 'Mad'
// });
// // Save the new cat to the DB (we use a callback function because the interaction betwee JS and MongoDB takes time)
// george.save(function(err, cat){
//     if(err) {
//         console.log('Something went wrong!');
//     } else {
//         console.log('Cat saved to the DB: ' + cat);
        
//     }
// });

// Create an element in the DB
Cat.create({
    name: "Snow White",
    age: 15,
    temperament: "Bland"
}, function(err, cat){
    if(err) {
        console.log('Something went wrong! ' + err);
    } else {
        console.log('Cat created in the DB: ' + cat);
    }
});

// Retrieve all cats from the DB (using the 'find' method on our 'Cat' model (line 11))
Cat.find({}, function(err, cats){
    if(err) {
        console.log('Something went wrong! ' + err);
    } else {
        console.log('Cat(s) found in the DB: ' + cats);
    }
});

