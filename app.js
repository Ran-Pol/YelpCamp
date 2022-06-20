const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
// Getting the model that we create from the origional Schema 
const Campground = require("./models/campground")

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
//  EJS is a simple templating language that lets you generate HTML markup with plain JavaScript. 
app.set("view engine", "ejs");




app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({
        title: 'My Backyard',
        price: '500',
        description: 'Top of the line at an affordable price',
        location: "DR"
    })
    await camp.save();
    res.send(camp);
})


app.listen(3000, () => {
    console.log("Serving on port 3000")
})



