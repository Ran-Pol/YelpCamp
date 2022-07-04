const express = require('express');
const router = express.Router({ mergeParams: true });
//Creating a wrapper function to handle our ASYNC routes ERRORHandling
//This allow us to forgo the use of try&catch methods while dealing with ASYNC functions
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

// Getting the model that we create from the origional Schema 
const Campground = require("../models/campground")
const Review = require("../models/review")

// JoiSchema Vaidation
const { reviewSchema } = require('../joiSchema');



const validateReview = (req, res, next) => {
    const newReview = req.body;
    const { error } = reviewSchema.validate(newReview);
    if (error) {
        //const message = result.error.details[0].message
        console.log("inside of the if statement for error")
        const message = error.details.map(el => el.message).join(",")
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}




////////Create Reviews Route
router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params
    const campGround = await Campground.findById(id)
    // console.log("This is the campgroudn inside create Route: ", campGround)
    const newReview = new Review(req.body.review)
    campGround.reviews.push(newReview);
    await newReview.save()
    await campGround.save()
    // const extraCamp = await campGround.populate('Review').then(data => console.log(data))
    // console.log(campGround);
    res.redirect(`/campgrounds/${id}`)

}))



////////Delete Reviews Route
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;