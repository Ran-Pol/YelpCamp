const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundsSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String
});

module.exports = mongoose.model("Campground", CampgroundsSchema);