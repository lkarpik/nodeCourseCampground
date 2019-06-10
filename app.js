const express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds"),
    User = require("./models/user"),
    method = require("method-override"),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);


// Seed data 
// seedDB();
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");



app.use(express.urlencoded());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(method("_method"));
app.use(flash());

app.set("view engine", "ejs");
// db connextion
let database = process.env.DATABASEURL || 'mongodb+srv://lkarpik:Lakis23@sandbox-0erkh.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(database, {
    useNewUrlParser: true,
    useFindAndModify: false
});

// PASSPORT CONF
app.use(session({
    secret: "This is great day!",
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROUTES RES VARIABLES 
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.time = time;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    // console.log(res.locals);
    next();

});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


const time = new Date;
time.setHours(time.getHours() + 2);


// SERVER
const PORT = process.env.PORT || 3000;
const HOST = process.env.IP || "0.0.0.0";
app.listen(PORT, HOST, function () {
    console.log('Started YeplpCamp app at ' + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " at: " + HOST + ":" + PORT);
});