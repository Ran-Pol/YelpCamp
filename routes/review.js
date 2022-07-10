// Imports
const express = require('express');
const router = express.Router({ mergeParams: true });

// Import review controllers
const reviewControllers = require('../controllers/reviews')

// Import validation middlewares
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware")

////////Create Reviews Route
router.post('/', isLoggedIn, validateReview, reviewControllers.createReview)

////////Delete Reviews Route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviewControllers.deleteReview)

module.exports = router;