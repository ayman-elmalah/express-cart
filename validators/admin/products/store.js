const { body } = require('express-validator');

exports.validate = [
    body('title').notEmpty().withMessage("Title is required").isString().withMessage("Title must be string").isLength({min: 5}).withMessage("Title min length is 5 characters"),
    body('price').notEmpty().withMessage("Price is required").isDecimal().withMessage("Price must be float"),
    body('description').notEmpty().withMessage("Description is required").isString().withMessage("Description must be string").isLength({min: 5}).withMessage("Description min length is 5 characters")
];