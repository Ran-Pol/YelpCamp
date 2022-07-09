const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')

// Register//GET
router.get('/register', (req, res) => {
    res.render('users/register')
});

// Register//POST
router.post('/register', catchAsync(async (req, res) => {
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
}));


// Login//GET
router.get('/login', (req, res) => {
    res.render('users/login')
});

// Login//POST
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    console.log("Before:")
    console.log(req.session)
    delete req.session.returnTo;
    console.log("After:")
    console.log(req.session)
    res.redirect(redirectUrl);
});

// Logout
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });

});

module.exports = router;
