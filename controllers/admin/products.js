var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
const { validationResult } = require('express-validator');

var Product = require('../../models/product');
var Category = require('../../models/category');

/**
 * List of products
 *
 * @param req
 * @param res
 * @param next
 */
exports.index = async (req, res, next) => {
    var products = await Product.find();
    var products_count = await Product.count();

    res.render("admin/products/index", {
        products: products,
        products_count: products_count,
    });
};

/**
 * Create new product
 *
 * @param req
 * @param res
 * @param next
 */
exports.create = async (req, res, next) => {
    var title = "";
    var slug = "";
    var description = "";
    var price = "";
    var categories = await Category.find();

    res.render('admin/products/create', {
        title: title,
        slug: slug,
        description: description,
        price: price,
        categories: categories
    });
};

/**
 * Store product
 *
 * @param req
 * @param res
 * @param next
 */
exports.store = async (req, res, next) => {
    var image = typeof req.files.image !== "undefined" ? req.files.image.name : "";

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "")
        slug = title.replace(/\s+/g, '-').toLowerCase();
    var description = req.body.description;
    var price = req.body.price;
    var category = req.body.category;
    var categories = await Category.find();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('admin/products/create', {
            errors: errors.array(),
            title: title,
            slug: slug,
            description: description,
            price: price,
            category: category,
            categories: categories
        });
    }

    const product_is_exist = await Product.findOne({slug: slug});

    if(product_is_exist) {
        req.flash('danger', "Product slug is already exists");
        res.render('admin/products/create', {
            title: title,
            slug: slug
        });
    }

    var product = new Product({title: title, slug: slug, price: parseFloat(price).toFixed(2), description: description, category: category, image: image});

    try {
        var result = await product.save();

        await mkdirp('public/uploads/images/products/' + result._id);

        await mkdirp('public/uploads/images/products/' + result._id + '/gallery');

        await mkdirp('public/uploads/images/products/' + result._id + '/gallery/thumbs');

        if (image !== "") {
            var productImage = req.files.image;
            var path = 'public/uploads/images/products/' + result._id + '/' + image;

            await productImage.mv(path);
        }

        req.flash('success', "Product created successfully");

        res.redirect('/admin/products');
    } catch(error) {
        req.flash('danger', "There is an error occurs");

        res.redirect('/admin/products');
    }
};

/**
 * Edit existing product
 *
 * @param req
 * @param res
 * @param next
 */
exports.edit = async (req, res, next) => {
    var product = await Product.findOne({_id: req.params.product});

    if(! product) {
        req.flash('danger', "There is an error occurs");

        res.redirect('/admin/products');
    }

    var title = product.title;
    var slug = product.slug;
    var description = product.description;
    var price = product.price;
    var category = product.category;
    var categories = await Category.find();

    res.render('admin/products/edit', {
        id: product._id,
        title: title,
        slug: slug,
        description: description,
        price: price,
        category: category,
        categories: categories
    });
};

/**
 * Update existing  product
 *
 * @param req
 * @param res
 * @param next
 */
exports.update = async (req, res, next) => {
    var product = await Product.findOne({_id: req.params.product});

    if(! product) {
        req.flash('danger', "There is an error occurs");

        res.redirect('/admin/products');
    }

    var image = typeof req.files.image !== "undefined" ? req.files.image.name : "";

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "")
        slug = title.replace(/\s+/g, '-').toLowerCase();
    var description = req.body.description;
    var price = req.body.price;
    var category = req.body.category;
    var categories = await Category.find();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('admin/products/edit', {
            errors: errors.array(),
            title: title,
            slug: slug,
            description: description,
            price: parseFloat(price).toFixed(2),
            category: category,
            categories: categories,
            id: product._id
        });
    }

    const product_is_exist = await Product.findOne({slug: slug, _id: {$ne: product._id}});

    if(product_is_exist) {
        req.flash('danger', "Product slug is already exists");
        res.render('admin/products/edit', {
            title: title,
            slug: slug,
            id: product._id
        });
    }

    product.title = title;
    product.slug = slug;
    product.description = description;
    product.price = price;
    product.category = category;
    product.image = image;

    try {
        var result = await product.save();

        await mkdirp('public/uploads/images/products/' + result._id);

        await mkdirp('public/uploads/images/products/' + result._id + '/gallery');

        await mkdirp('public/uploads/images/products/' + result._id + '/gallery/thumbs');

        if (image !== "") {
            var productImage = req.files.image;
            var path = 'public/uploads/images/products/' + result._id + '/' + image;

            await productImage.mv(path);
        }

        req.flash('success', "Product created successfully");

        res.redirect('/admin/products');
    } catch(error) {
        req.flash('danger', "There is an error occurs");

        res.redirect('/admin/products');
    }
};

/**
 * Destroy existing  product
 *
 * @param req
 * @param res
 * @param next
 */
exports.destroy = async (req, res, next) => {
    try {

        var product = await Product.findOneAndDelete({_id: req.params.product});

        if(! product) {
            req.flash('danger', "There is an error occurs");

            res.redirect('/admin/products');
        }

        req.flash('success', "Page deleted successfully");

        res.redirect('/admin/products');
    } catch(error) {
        req.flash('danger', "There is an error occurs");

        res.redirect('/admin/products');
    }
};