const mongoose = require("mongoose");
const Review = require("./review")
const Schema = mongoose.Schema;

const CampgroundsSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});



// DELETE ALL ASSOCIATED REVIEWS AFTER A CAMPGROUND IS DELETED
// Campground Delete Middleware
CampgroundsSchema.post('findOneAndDelete', async function (campGround) {
    if (campGround.reviews.length) {
        const res = await Review.deleteMany({ _id: { $in: campGround.reviews } })
        console.log(res);
    }
})



module.exports = mongoose.model("Campground", CampgroundsSchema);