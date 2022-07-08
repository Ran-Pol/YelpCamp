module.exports.isLoggedIn = (req, res, nex) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be login!')
        return res.redirect('/login')
    }
    next();
}