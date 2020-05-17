// Require mongoose and campground information
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

// Seed campgrounds
const seeds = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

// We create the seed function
function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        // Inside this callback function we create the campgrounds to ensure they are created after the deletion of campgrounds
        console.log('Campgrounds removed!');
        //Add seed campgrounds
        seeds.forEach((seed) => {
            Campground.create(seed, (err, campground) => {
                if(err){
                    console.log(err);
                } else {
                    console.log("Campground added.");
                    //Add a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, (err, comment) => {
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log('Comment added to campground.');
                                //Add another comment. This is optional and could be handled in a better way.
                                Comment.create(
                                    {
                                        text: "This place is great, shut up Homer!",
                                        author: "Bart"
                                    }, (err, comment) => {
                                        if(err){
                                            console.log(err);
                                        } else {
                                            campground.comments.push(comment);
                                            campground.save();
                                            console.log('Comment added to campground.');
                                        }
                                    });
                            }
                        });
                }
            });
        });
    });
}

// We export the seedDB function to be used in the app.js file
module.exports = seedDB;