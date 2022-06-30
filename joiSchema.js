const Joi = require('joi')

module.exports.campgroundSchema = Joi.object({
    // In case we choose to go with Colt's way: 
    // name='campground[title]'
    // campGround: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    city: Joi.string().required(),
    state: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    // }).required()
})




module.exports.reviewSchema = Joi.object({
    // In case we choose to go with Colt's way: 
    // name='campground[title]'
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(0).max(5),
    }).required()
})

