const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose); // This adds some methods to our user.

module.exports = mongoose.model('User', UserSchema);