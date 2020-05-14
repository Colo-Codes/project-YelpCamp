// Initializing Mongoose
const mongoose = require('mongoose');

// Creating the comment schema
const commentSchema = mongoose.Schema({
    text: String,
    author: String
});

// Exporting
module.exports = mongoose.model('Comment', commentSchema); 