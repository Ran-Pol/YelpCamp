// Getting the model that we create from the origional Schema 
const Campground = require("../models/campground")
const Review = require("../models/review")

//Creating a wrapper function to handle our ASYNC routes ERRORHandling
//This allow us to forgo the use of try&catch methods while dealing with ASYNC functions
const catchAsync = require('../utils/catchAsync')



////////Create Reviews Route
module.exports.createReview = catchAsync(async (req, res) => {
    const { id } = req.params
    const campGround = await Campground.findById(id)
    // console.log("This is the campground inside create Route: ", campGround)
    const newReview = new Review(req.body.review)
    newReview.author = req.user;
    campGround.reviews.push(newReview);
    await newReview.save()
    await campGround.save()
    req.flash("success", "Your new review was successfully created!")
    res.redirect(`/campgrounds/${id}`)

})
////////Delete Reviews Route
module.exports.deleteReview = catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Your review was successfully deleted!")
    res.redirect(`/campgrounds/${id}`);
})