const express = require('express');
const router = express.Router();
//Creating a wrapper function to handle our ASYNC routes ERRORHandling
//This allow us to forgo the use of try&catch methods while dealing with ASYNC functions
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

// Getting the model that we create from the origional Schema 
const Review = require("../models/review")

// JoiSchema Vaidation
const { reviewSchema } = require('./joiSchema');



const validateReview = (req, res, next) => {
    const newReview = req.body;
    // console.log(newReview)
    const { error } = reviewSchema.validate(newReview);
    if (error) {
        //const message = result.error.details[0].message
        const message = error.details.map(el => el.message).join(",")
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}




////////Reviews Route
router.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
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



////////Delete Route
router.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;