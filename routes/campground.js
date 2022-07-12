const express = require('express');
const router = express.Router();
const campControllers = require('../controllers/campgrounds')
const { isLoggedIn,
    validateCampground,
    isAuthor } = require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage })

// Chaining Router Routes. This is use to chain together http vers that share similar path

router.route('/')
    .get(campControllers.index) ////////CRUD: => INDEX
    // .post(isLoggedIn, validateCampground, campControllers.postNewCampground) ////////CRUD: => Create    
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files)
        res.send('It worked')
    })
////////CRUD: => New    
// ////API ENDPOINT: =>  /products/new
////////HTTP VERB: => GET
// ////PURPOSE: => Display form to add a new product
////////MONGOOSE METHOD: => N/A   
router.get('/new', isLoggedIn, campControllers.getNewCampground)


router.route('/:id')
    .get(campControllers.showCampground) ////////CRUD: => SHOW   
    .put(isLoggedIn, isAuthor, validateCampground, campControllers.updateCampground) ////////CRUD: => UPDATE
    .delete(isLoggedIn, isAuthor, campControllers.deleteCampground) ////////CRUD: => DELETE



////////CRUD: => EDIT   
// ////API ENDPOINT: =>  /products/:id/edit
////////HTTP VERB: => GET
// ////PURPOSE: => Show edit form for one product
////////MONGOOSE METHOD: => Product.findById()
router.get('/:id/edit', isLoggedIn, isAuthor, campControllers.editCampground);


module.exports = router;




// ////////CRUD: => INDEX    
// // ////API ENDPOINT: =>  /products
// ////////HTTP VERB: => GET
// // ////PURPOSE: => Display a list of all products
// ////////MONGOOSE METHOD: => Product.find()
// router.get('/', campControllers.index)


// ////////CRUD: => New    
// // ////API ENDPOINT: =>  /products/new
// ////////HTTP VERB: => GET
// // ////PURPOSE: => Display form to add a new product
// ////////MONGOOSE METHOD: => N/A   
// router.get('/new', isLoggedIn, campControllers.getNewCampground)


// ////////CRUD: => Create     
// // ////API ENDPOINT: =>  /products
// ////////HTTP VERB: => POST
// // ////PURPOSE: => Add a new product to the database, redirect somewhere
// ////////MONGOOSE METHOD: => Product.create() or Product.save()
// router.post('/', isLoggedIn, validateCampground, campControllers.postNewCampground)


// ////////CRUD: => SHOW     
// // ////API ENDPOINT: =>  /products/:id
// ////////HTTP VERB: => GET
// // ////PURPOSE: => Show information about one product
// ////////MONGOOSE METHOD: => Product.findById()
// router.get('/:id', campControllers.showCampground)


// ////////CRUD: => EDIT   
// // ////API ENDPOINT: =>  /products/:id/edit
// ////////HTTP VERB: => GET
// // ////PURPOSE: => Show edit form for one product
// ////////MONGOOSE METHOD: => Product.findById()
// router.get('/:id/edit', isLoggedIn, isAuthor, campControllers.editCampground);


// ////////CRUD: => UPDATE  
// // ////API ENDPOINT: =>  /products/:id
// ////////HTTP VERB: => PUT
// // ////PURPOSE: => Update a particular product's data then redirect somewhere
// ////////MONGOOSE METHOD: =>  Product.findByIdAndUpdate()
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, campControllers.updateCampground);


// ////////CRUD: => DELETE
// // ////API ENDPOINT: =>  /products/:id
// ////////HTTP VERB: => DELTE
// // ////PURPOSE: => Delete a particular product's data then redirect somewhere
// ////////MONGOOSE METHOD: =>  Product.findByIdAndDelete()
// router.delete('/:id', isLoggedIn, isAuthor, campControllers.deleteCampground)

// module.exports = router;