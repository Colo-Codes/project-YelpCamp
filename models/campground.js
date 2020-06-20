// Initializing Mongoose
const mongoose = require('mongoose');

// Setting up the Campground schema (for mongoose and mongodb)
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId, // Referencing data
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId, // Referencing data
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);