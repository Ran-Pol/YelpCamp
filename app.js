const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate')
//Creating a wrapper function to handle our ASYNC routes ERRORHandling
//This allow us to forgo the use of try&catch methods while dealing with ASYNC functions
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
// Getting the model that we create from the origional Schema 
const Campground = require("./models/campground")
const Review = require("./models/review")
const stateList = require("./seeds/stateList")
// req.body Parser
bodyParser = require('body-parser')
const { campgroundSchema } = require('./joiSchema');
const { reviewSchema } = require('./joiSchema');
// Lodash is a utiliti package that has some of the most common day to day 
//javascripts methods/operations
const _ = require('lodash');

// Reuqiring the campground routes that we seperated to a different file to clean the main app file
const campgrounds = require("./routes/campground");
const reviews = require("./routes/review");


mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
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


// We are creating a middleware for our campgroundsroutes that are store in a seperate files
app.use("/campgrounds", campgrounds)
// We are creating a middleware for our reviews routes that are store in a seperate files
app.use("/campgrounds", reviews)


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
