const express = require('express');
const router = express.Router();

const { index,
    getNewCampground,
    postNewCampground,
    showCampground,
    editCampground,
    updateCampground,
    deleteCampground } = require('../controllers/campgrounds')


const { isLoggedIn,
    validateCampground,
    isAuthor } = require('../middleware')



////////CRUD: => INDEX    
// ////API ENDPOINT: =>  /products
////////HTTP VERB: => GET
// ////PURPOSE: => Display a list of all products
////////MONGOOSE METHOD: => Product.find()
router.get('/', index)


////////CRUD: => New    
// ////API ENDPOINT: =>  /products/new
////////HTTP VERB: => GET
// ////PURPOSE: => Display form to add a new product
////////MONGOOSE METHOD: => N/A   
router.get('/new', isLoggedIn, getNewCampground)


////////CRUD: => Create     
// ////API ENDPOINT: =>  /products
////////HTTP VERB: => POST
// ////PURPOSE: => Add a new product to the database, redirect somewhere
////////MONGOOSE METHOD: => Product.create() or Product.save()
router.post('/', isLoggedIn, validateCampground, postNewCampground)


////////CRUD: => SHOW     
// ////API ENDPOINT: =>  /products/:id
////////HTTP VERB: => GET
// ////PURPOSE: => Show information about one product
////////MONGOOSE METHOD: => Product.findById()
router.get('/:id', showCampground)


////////CRUD: => EDIT   
// ////API ENDPOINT: =>  /products/:id/edit
////////HTTP VERB: => GET
// ////PURPOSE: => Show edit form for one product
////////MONGOOSE METHOD: => Product.findById()
router.get('/:id/edit', isLoggedIn, isAuthor, editCampground);


////////CRUD: => UPDATE  
// ////API ENDPOINT: =>  /products/:id
////////HTTP VERB: => PUT
// ////PURPOSE: => Update a particular product's data then redirect somewhere
////////MONGOOSE METHOD: =>  Product.findByIdAndUpdate()
router.put('/:id', isLoggedIn, isAuthor, validateCampground, updateCampground);


////////CRUD: => DELETE
// ////API ENDPOINT: =>  /products/:id
////////HTTP VERB: => DELTE
// ////PURPOSE: => Delete a particular product's data then redirect somewhere
////////MONGOOSE METHOD: =>  Product.findByIdAndDelete()
router.delete('/:id', isLoggedIn, isAuthor, deleteCampground)

module.exports = router;