const express = require('express');
const router = express.Router();
//Creating a wrapper function to handle our ASYNC routes ERRORHandling
//This allow us to forgo the use of try&catch methods while dealing with ASYNC functions
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

// Getting the model that we create from the origional Schema 
const Campground = require("../models/campground")

// JoiSchema Vaidation
const { campgroundSchema } = require('../joiSchema');

const stateList = require("../seeds/stateList")

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


////////CRUD: => INDEX    
// ////API ENDPOINT: =>  /products
////////HTTP VERB: => GET
// ////PURPOSE: => Display a list of all products
////////MONGOOSE METHOD: => Product.find()
router.get('/', catchAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps })

}))


////////CRUD: => New    
// ////API ENDPOINT: =>  /products/new
////////HTTP VERB: => GET
// ////PURPOSE: => Display form to add a new product
////////MONGOOSE METHOD: => N/A   
router.get('/new', (req, res) => {
    res.render("campgrounds/new", { stateList })
})


////////CRUD: => Create     
// ////API ENDPOINT: =>  /products
////////HTTP VERB: => POST
// ////PURPOSE: => Add a new product to the database, redirect somewhere
////////MONGOOSE METHOD: => Product.create() or Product.save()
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
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
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { camp })
}))


////////CRUD: => EDIT   
// ////API ENDPOINT: =>  /products/:id/edit
////////HTTP VERB: => GET
// ////PURPOSE: => Show edit form for one product
////////MONGOOSE METHOD: => Product.findById()
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', { camp, stateList })
}));


////////CRUD: => UPDATE  
// ////API ENDPOINT: =>  /products/:id
////////HTTP VERB: => PUT
// ////PURPOSE: => Update a particular product's data then redirect somewhere
////////MONGOOSE METHOD: =>  Product.findByIdAndUpdate()
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
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
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports = router;