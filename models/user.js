const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserShema = new mongoose.Schema({
   username: String,
   password: String
});

UserShema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserShema);