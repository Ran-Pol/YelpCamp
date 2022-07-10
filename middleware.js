// Getting the model that we create from the origional Schema 
const Campground = require("./models/campground")
// JoiSchema Vaidation
const { campgroundSchema, reviewSchema } = require('./joiSchema');

const ExpressError = require('./utils/ExpressError')



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be login!')
        return res.redirect('/login')
    }
    next();
}


//Middleware function in order to validate all post/put HTPP request
//But we dont want to do it like: app.use() which will run on every request.
// Instead we want to select the particular route we want to use this
// middleware
module.exports.validateCampground = (req, res, next) => {
    const campGround = req.body;
    // console.log(req.body)
    const { error } = campgroundSchema.validate(campGround);
    if (error) {
        //const message = result.error.details[0].message
        const message = error.details.map(el => el.message).join(",")
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const getCamp = await Campground.findById(id);

    if (!getCamp.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}



module.exports.validateReview = (req, res, next) => {
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

