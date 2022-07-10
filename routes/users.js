const express = require('express');
const router = express.Router();

const passport = require('passport')
const usersControllers = require('../controllers/users')

// Router.route Version

//Register
router.route('/register')
    .get(usersControllers.getRegister)// Register//GET
    .post(usersControllers.postRegister)// Register//POST

//Login
router.route('/login')
    .get(usersControllers.getLogin)// Login//GET
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), usersControllers.postLogin) // Login//POST

// Logout
router.get('/logout', usersControllers.getLogout);

module.exports = router;




// // Register//GET
// router.get('/register', usersControllers.getRegister);

// // Register//POST
// router.post('/register', usersControllers.postRegister);


// // Login//GET
// router.get('/login', usersControllers.getLogin);

// // Login//POST
// router.post('/login', passport.authenticate('local',
//     {
//         failureFlash: true, failureRedirect: '/login',
//         keepSessionInfo: true
//     }), usersControllers.postLogin);

// // Logout
// router.get('/logout', usersControllers.getLogout);

// module.exports = router;
