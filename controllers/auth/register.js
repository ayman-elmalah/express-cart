const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');

var User = require('../../models/user');

/**
 * Show register form
 *
 * @param req
 * @param res
 * @param next
 */
exports.showRegisterForm = (req, res, next) => {
    var title = "Register";

    res.render('auth/register/form', {
        title: title,
    });
};

/**
 * Register
 *
 * @param req
 * @param res
 * @param next
 */
exports.register = async (req, res, next) => {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var title = "Register";

    body('password_confirmation').equals(password).withMessage("Password not confirmed");

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.render('auth/register/form', {
            errors: errors.array(),
            title: title,
            user: null
        });
    }

    const user_is_exist = await User.findOne({username: username});

    if(user_is_exist) {
        req.flash('danger', 'Username exists, choose another!');
        res.redirect('/auth/register');
    }

    var user = new User({name: name, email: email, username: username, password: password, admin: 0});
    user.password = await bcrypt.hash(password, 12);

    try {
        await user.save();

        req.flash('success', 'You are now registered!');
        res.redirect('/auth/login')
    } catch(error) {
        req.flash('danger', "There is an error occurs");
        res.redirect('/auth/register');
    }
};