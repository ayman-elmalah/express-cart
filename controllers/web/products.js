var Product = require('../../models/product');

/**
 * All products
 *
 * @param req
 * @param res
 * @param next
 */
exports.index = async (req, res, next) => {
    var products = await Product.find();

    res.render('web/products/index', {
        title: "All products",
        products: products
    });
};

/**
 * Category products
 *
 * @param req
 * @param res
 * @param next
 */
exports.categoryProducts = async (req, res, next) => {
    var category = req.params.category;

    var products = await Product.find({category: category});

    res.render('web/products/index', {
        title: `${category} products`,
        products: products
    });
};

/**
 * Show product
 *
 * @param req
 * @param res
 * @param next
 */
exports.show = async (req, res, next) => {
    var slug = req.params.product;

    var product = await Product.findOne({slug: slug});

    if(! product) {
        res.redirect('/');
    }

    var loggedIn = (req.isAuthenticated()) ? true : false;

    res.render('web/products/show', {
        title: `${product.title}`,
        product: product,
        loggedIn: loggedIn
    });
};