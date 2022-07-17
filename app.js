if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const mongoSanitize = require('express-mongo-sanitize')
//Creating a wrapper function to handle our ASYNC routes ERRORHandling
//This allow us to forgo the use of try&catch methods while dealing with ASYNC functions
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
// req.body Parser
const bodyParser = require('body-parser')
// create application/json parser
const jsonParser = bodyParser.json()

// Lodash is a utiliti package that has some of the most common day to day 
//javascripts methods/operations
const _ = require('lodash');

const MongoDBStore = require('connect-mongo');

const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user')



// Requiring the campground routes that we seperated to a different file to clean the main app file
const campgroundsRoutes = require("./routes/campground");
const reviewsRoutes = require("./routes/review");
const usersRoutes = require("./routes/users");


// This is the local connection to the MongoDB on my Computer
const localDatabase = 'mongodb://localhost:27017/yelp-camp'
// This is the MongoDB Atlas
const dbUrl = process.env.DB_URL
mongoose.connect(localDatabase, {
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
// Creating a middleware for json fetch 
app.use(jsonParser);
// This method-override module allow us to modify HTTP request while working with FORMS
app.use(methodOverride('_method'));
// To help filter hacking string in the query like: $
app.use(mongoSanitize({
    replaceWith: '_'
}))


const store = new MongoDBStore({
    mongoUrl: localDatabase,
    crypto: 'thisadvdsds',
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})
// This are the setting arguments to the session
const sessionConfig = {
    store,
    name: "homeRunRun",
    secret: 'thisshouldbeabetterscret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use(flash());

// ==================== Setup Passport =============
app.use(passport.initialize())
app.use(passport.session())
// Hello passport we would like you to use the local strategy we downloded.
//Use the static methods that comes with passport-local-mongoose
passport.use(new localStrategy(User.authenticate()))
// Get user into a session
passport.serializeUser(User.serializeUser())
// Get user out of the session
passport.deserializeUser(User.deserializeUser())


// Route middleware on every single request
// Whatever is in the flash under success
// Have acces in our locals under the keys success
app.use((req, res, next) => {
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.welcome = req.flash('welcome')
    next();
})




//Routes//
// Users Routes
app.use("/", usersRoutes)
// We are creating a middleware for our campgroundsroutes that are store in a seperate files
app.use("/campgrounds", campgroundsRoutes)
// We are creating a middleware for our reviews routes that are store in a seperate files
app.use("/campgrounds/:id/reviews", reviewsRoutes)


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
