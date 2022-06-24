const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
// Getting the model that we create from the origional Schema 
const Campground = require("./models/campground")
const stateList = require("./seeds/stateList")

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
// We want to use this one ejs-mate insted of the default.
app.engine('ejs', ejsMate);
//  EJS is a simple templating language that lets you generate HTML markup with plain JavaScript. 
app.set("view engine", "ejs");
// To serve static files such as images, CSS files, and JavaScript files, 
// use the express.static built-in middleware function in Express.
// app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')))
//Express.urlencoded allows us to read the body data/ parses the data
app.use(express.urlencoded({ extended: true }));
// This method-override module allow us to modify HTTP request while working with FORMS
app.use(methodOverride('_method'));



//Creating a wrapper function to handle our ASYNC routes functions erros
//This allow us to forgo the use of try&catch methods
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
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
app.get('/campgrounds', wrapAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps });

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
app.post('/campgrounds', async (req, res) => {
    const { title, price, city, state, description, image } = req.body;
    const newCamp = await addNewCamp(title, price, city, state, description, image);
    res.redirect(`/campgrounds/${newCamp._id}`);

})

////////CRUD: => SHOW     
// ////API ENDPOINT: =>  /products/:id
////////HTTP VERB: => GET
// ////PURPOSE: => Show information about one product
////////MONGOOSE METHOD: => Product.findById()
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/show', { camp })
})


////////CRUD: => EDIT   
// ////API ENDPOINT: =>  /products/:id/edit
////////HTTP VERB: => GET
// ////PURPOSE: => Show edit form for one product
////////MONGOOSE METHOD: => Product.findById()
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', { camp, stateList })
});


////////CRUD: => UPDATE  
// ////API ENDPOINT: =>  /products/:id
////////HTTP VERB: => PUT
// ////PURPOSE: => Update a particular product's data then redirect somewhere
////////MONGOOSE METHOD: =>  Product.findByIdAndUpdate()
app.put('/campgrounds/:id', async (req, res) => {
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
});


////////CRUD: => DELETE
// ////API ENDPOINT: =>  /products/:id
////////HTTP VERB: => DELTE
// ////PURPOSE: => Delete a particular product's data then redirect somewhere
////////MONGOOSE METHOD: =>  Product.findByIdAndDelete()
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})


// Creating our custome error handler message using a middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).send(message);
})


app.listen(3000, () => {
    console.log("Serving on port 3000")
})




function addNewCamp(title, price, city, state, description, image) {
    const newCamp = new Campground({
        title: title,
        price: price,
        description: description,
        location: `${city}, ${state}`,
        image: image,
    })

    newCamp.save()
        .then(p => {
            console.log(p)
        })
        .catch(e => {
            console.log(e)
        })

    return newCamp
}
