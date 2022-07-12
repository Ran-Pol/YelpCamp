const { string } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review")
const User = require("./user")
const Schema = mongoose.Schema;

const CampgroundsSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [{
        url: String,
        filename: String
    }],
    author:
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});



// DELETE ALL ASSOCIATED REVIEWS AFTER A CAMPGROUND IS DELETED
// Campground Delete 
// Query Middleware
CampgroundsSchema.post('findOneAndDelete', async function (campGround) {
    console.log(campGround)
    if (campGround.reviews.length) {
        const res = await Review.deleteMany({ _id: { $in: campGround.reviews } })
        console.log(res);
    }
})



module.exports = mongoose.model("Campground", CampgroundsSchema);