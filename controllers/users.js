// imports/requires
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');


// Register//GET
module.exports.getRegister = (req, res) => {
    res.render('users/register')
}

// Register//POST
module.exports.postRegister = catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash('welcome', 'Welcome to YelpCamp');
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
});

// Login//GET
module.exports.getLogin = (req, res) => {
    res.render('users/login')
};

// Login//POST
module.exports.postLogin = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

// Logout
module.exports.getLogout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });

};