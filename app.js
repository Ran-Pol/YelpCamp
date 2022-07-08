const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
//Creating a wrapper function to handle our ASYNC routes ERRORHandling
//This allow us to forgo the use of try&catch methods while dealing with ASYNC functions
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
// req.body Parser
bodyParser = require('body-parser')
// Lodash is a utiliti package that has some of the most common day to day 
//javascripts methods/operations
const _ = require('lodash');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user')




// Requiring the campground routes that we seperated to a different file to clean the main app file
const campgrounds = require("./routes/campground");
const reviews = require("./routes/review");


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
})
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const app = express();


// Here we are setting the path to our views folder. Here we are going to create the files/codes 
// that are needed to Dynamicaly create pages to later render
app.set("views", path.join(__dirname, "views"));
// Design Engine to Run/Parse EJS. We are telling express that 
// We want to use this ejs engine: ejs-mate insted of the default.
app.engine('ejs', ejsMate);
//  EJS is a simple templating language that lets you generate HTML markup with plain JavaScript. 
app.set("view engine", "ejs");
// To serve static files such as images, CSS files, and JavaScript files, 
// use the express.static built-in middleware function in Express.
// app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')))
//Express.urlencoded allows us to read the body data/ parses the data
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// This method-override module allow us to modify HTTP request while working with FORMS
app.use(methodOverride('_method'));

// This are the setting arguments to the session
const sessionConfig = {
    secret: 'thisshouldbeabetterscret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use(flash());

// Route middleware on every single request
// Whatever is in the flash under success
// Have acces in our locals under the keys success
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')

    next();
})

app.use(passport.initialize());
app.use(passport.session());
// Hello passport we would like you to use the local strategy we downloded.
//Use the static methods that comes with passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
// Get user into a session
passport.serializeUser(User.serializeUser());
// Get user out of the session
passport.deserializeUser(User.deserializeUser());


//Routes//
// We are creating a middleware for our campgroundsroutes that are store in a seperate files
app.use("/campgrounds", campgrounds)
// We are creating a middleware for our reviews routes that are store in a seperate files
app.use("/campgrounds/:id/reviews", reviews)


////////Homepage 
app.get('/', (req, res) => {
    res.render('home');

})


app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
}
)

// Creating our custome error handler message using a middleware
app.use((err, req, res, next) => {
    // console.log(err)
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong"
    res.status(statusCode).render('error', { err })
})


app.listen(3000, () => {
    console.log("Serving on port 3000")
})
