// Initializing Mongoose
const mongoose = require('mongoose');

// Creating the comment schema
const commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

// Exporting
module.exports = mongoose.model('Comment', commentSchema); 