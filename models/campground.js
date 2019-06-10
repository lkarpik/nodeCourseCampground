const mongoose = require("mongoose");


let campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    img: String,
    description: String,
    // ASSIOCIATE ONE TO MANY!!!
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    // ASSIOCIATE ONE TO ONE!!!
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" 
        },
        username: String
    }
});

module.exports = mongoose.model("Campground", campgroundSchema);

