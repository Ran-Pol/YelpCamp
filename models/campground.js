const { string } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review")
const User = require("./user")
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upoad', '/upload/w_200');
})


const CampgroundsSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String, // Don't do `{ geometry: { type: String } }`
            enum: ['Point'], // 'geometry.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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