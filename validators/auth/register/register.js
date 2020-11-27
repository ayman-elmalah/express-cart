const { body } = require('express-validator');

exports.validate = [
    body('name').notEmpty().withMessage("Name is required").isString().withMessage("Name must be string").isLength({min: 2, max: 100}).withMessage("Name min length is 5 characters and max is 100 characters"),
    body('email').notEmpty().withMessage("Email is required").isEmail().withMessage("Email must be e,ail").isLength({min: 5, max: 100}).withMessage("Email min length is 5 characters and max is 100 characters"),
    body('username').notEmpty().withMessage("Username is required").isString().withMessage("Username must be string").isLength({min: 2, max: 100}).withMessage("Username min length is 5 characters and max is 100 characters"),
    body('password').notEmpty().withMessage("Password is required").isString().withMessage("Password must be string").isLength({min: 8, max: 100}).withMessage("Password min length is 5 characters and max is 100 characters"),
];
