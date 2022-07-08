const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

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
        req.flash('welcome', 'Welcome to YelpCamp');
        res.redirect('/campgrounds')
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
router.post('/login', (req, res) => {
});

module.exports = router;
