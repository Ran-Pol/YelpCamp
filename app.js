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
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));

// This method-override module allow us to modify HTTP request while working with FORMS
app.use(methodOverride('_method'));


//Middleware function in order to validate all post/put HTPP request
//But we dont want to do it like: app.use() which will run on every request.
// Instead we want to select the particular route we want to use this
// middleware
const validateCampground = (req, res, next) => {
    const campGround = req.body;
    const { error } = campgroundSchema.validate(campGround);
    if (error) {
        //const message = result.error.details[0].message
        const message = error.details.map(el => el.message).join(",")
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}
const validateReview = (req, res, next) => {
    const newReview = req.body;
    console.log(newReview)
    const { error } = reviewSchema.validate(newReview);
    if (error) {
        //const message = result.error.details[0].message
        const message = error.details.map(el => el.message).join(",")
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}





////////Homepage 
app.get('/', (req, res) => {
    res.render('home');

})
////////CRUD: => INDEX    
// ////API ENDPOINT: =>  /products
////////HTTP VERB: => GET
// ////PURPOSE: => Display a list of all products
////////MONGOOSE METHOD: => Product.find()
app.get('/campgrounds', catchAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps })

}))


////////CRUD: => New    
// ////API ENDPOINT: =>  /products/new
////////HTTP VERB: => GET
// ////PURPOSE: => Display form to add a new product
////////MONGOOSE METHOD: => N/A   
app.get('/campgrounds/new', (req, res) => {
    res.render("campgrounds/new", { stateList })
})

////////CRUD: => Create     
// ////API ENDPOINT: =>  /products
////////HTTP VERB: => POST
// ////PURPOSE: => Add a new product to the database, redirect somewhere
////////MONGOOSE METHOD: => Product.create() or Product.save()
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // console.log(_.isEmpty(req.body.title))
    // if (_.isEmpty(req.body)) throw new ExpressError("Cannot Submit Empty Form", 400)
    const { title, price, city, state, description, image } = req.body;
    const location = `${city}, ${state}`;
    const newCamp = new Campground({ title, price, location, description, image });
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
}))



////////CRUD: => SHOW     
// ////API ENDPOINT: =>  /products/:id
////////HTTP VERB: => GET
// ////PURPOSE: => Show information about one product
////////MONGOOSE METHOD: => Product.findById()
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { camp })
}))


////////CRUD: => EDIT   
// ////API ENDPOINT: =>  /products/:id/edit
////////HTTP VERB: => GET
// ////PURPOSE: => Show edit form for one product
////////MONGOOSE METHOD: => Product.findById()
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', { camp, stateList })
}));


////////CRUD: => UPDATE  
// ////API ENDPOINT: =>  /products/:id
////////HTTP VERB: => PUT
// ////PURPOSE: => Update a particular product's data then redirect somewhere
////////MONGOOSE METHOD: =>  Product.findByIdAndUpdate()
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { title, price, city, state, description } = req.body;
    // const camp1 = await Campground.findById(id);
    // console.log(camp1)
    const camp = await Campground.findByIdAndUpdate(id, {
        title: title,
        price: price,
        description: description,
        location: `${city}, ${state}`
    }, { new: true })
    // console.log(camp)
    res.redirect('/campgrounds');
}));


////////CRUD: => DELETE
// ////API ENDPOINT: =>  /products/:id
////////HTTP VERB: => DELTE
// ////PURPOSE: => Delete a particular product's data then redirect somewhere
////////MONGOOSE METHOD: =>  Product.findByIdAndDelete()
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))


////////Reviews Route
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params
    const campGround = await Campground.findById(id)
    const newReview = new Review(req.body.review)
    campGround.reviews.push(newReview);
    await newReview.save()
    await campGround.save()
    // const extraCamp = await campGround.populate('Review').then(data => console.log(data))
    // console.log(campGround);
    res.redirect(`/campgrounds/${id}`)

}))



app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))





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
