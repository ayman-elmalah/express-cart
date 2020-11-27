const { body } = require('express-validator');

exports.validate = [
    body('title').notEmpty().withMessage("Title is required").isString().withMessage("Title must be string").isLength({min: 5}).withMessage("Title min length is 5 characters"),
];