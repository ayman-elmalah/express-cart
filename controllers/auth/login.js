const passport = require('passport');

/**
 * Show login form
 *
 * @param req
 * @param res
 * @param next
 */
exports.showLoginForm = (req, res, next) => {
    if (res.locals.user) res.redirect('/');

    var title = "Login";

    res.render('auth/login/form', {
        title: title,
    });
};

/**
 * Login
 *
 * @param req
 * @param res
 * @param next
 */
exports.login = async (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
};

/**
 * Logout
 *
 * @param req
 * @param res
 * @param next
 */
exports.logout = async (req, res, next) => {
    req.logout();

    req.flash('success', 'You are logged out!');
    res.redirect('/auth/login');
};