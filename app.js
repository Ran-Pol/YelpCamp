const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const methodOverride = require('method-override')
// const morgan = require('morgan')
// Getting the model that we create from the origional Schema 
const Campground = require("./models/campground")
const stateList = require("./seeds/stateList")
const appError = require('./appError')



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
//  EJS is a simple templating language that lets you  generate HTML markup with plain JavaScript. 
app.set("view engine", "ejs");
// To serve static files such as images, CSS files, and JavaScript files, 
// use the express.static built-in middleware function in Express.
// app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')))
//Express.urlencoded allows us to read the body data/ parses the data
app.use(express.urlencoded({ extended: true }));
// This method-override module allow us to modify HTTP request while working with FORMS
app.use(methodOverride('_method'));
// Testing Morgan middleware...Usually is use for debugging

// Creatig Our Personal Middleware that will run on all incoming requests/ all http verbs
// app.use((req, res, next) => {
//     req.requesTime = Date.now();
//     console.log(req.method.toUpperCase(), req.path, req.params, req.requesTime)
//     next()
// })
// app.use((req, res, next) => {
//     const { password } = req.query;
//     if (password === 'chickennugget') {
//         return next();
//     }
//     res.send("YOU NEED A PASSWORD!")

// })

// WE can acomplish the same thing as the above midleware like this:
const verifyPassword = (req, res, next) => {
    const { password } = req.query;
    if (password === 'chickennugget') {
        return next();
    }

    throw new appError("You need the master access to get in.", 401)
    // res.send("YOU NEED A PASSWORD!")
    // throw new appError("Password required!", 400)
};

app.get("/gallos", async (req, res, next) => {

    return next(new appError("This is the new app error", 403))
    console.log("hello");
}
)

app.get('/yes', (req, res) => {
    res.send("I'm working on this program 24/7. Lets see what happens 3 months from now.")
})


app.get('/admin', (res, req) => {
    throw new appError("You are not an Admin", 403)
})


app.get('/secret', verifyPassword, (req, res) => {
    res.send("I'm working on this program 24/7. Lets see what happens 3 months from now.")
})



function wrapAsync(fn) {
    reutrn function
}














app.get('/error', (req, res) => {
    chicken.toUpperCase();
})
// We can use this Middleware at the end of all routes 
// incase the page/the requeest was not found
app.use((req, res) => {
    res.send("Page not found")
})


// app.use((err, req, res, next) => {
//     console.log("#######################################");
//     console.log("##############ERRRRO############");
//     console.log("#######################################");
//     next(err)
// })

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something Went Wrong' } = err;
    res.status(status).send(message)
})


app.listen(3000, () => {
    console.log("Serving on port 3000")
})




function addNewCamp(title, price, city, state, description) {
    const newCamp = new Campground({
        title: title,
        price: price,
        description: description,
        location: `${city}, ${state}`
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
