exports.isUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('danger', 'Please log in.');
        res.redirect('/auth/login');
    }
}

exports.isAdmin = function(req, res, next) {
    if (req.isAuthenticated() && res.locals.user.admin === 1) {
        next();
    } else {
        req.flash('danger', 'Please log in as admin.');
        res.redirect('/auth/login');
    }
}
