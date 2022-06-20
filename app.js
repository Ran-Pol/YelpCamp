const express = require('express');
const app = express();
const path = require('path');



// Here we are setting the path to our views folder. Here we are going to create the files/codes 
// that are needed to Dynamicaly create pages to later render
app.set("views", path.join(__dirname, "views"));
//  EJS is a simple templating language that lets you generate HTML markup with plain JavaScript. 
app.set("view engine", "ejs");




app.get('/', (req, res) => {
    res.render('home')
})









app.listen(3000, () => {
    console.log("Serving on port 3000")
})



