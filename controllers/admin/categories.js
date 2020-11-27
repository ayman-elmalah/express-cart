const { validationResult } = require('express-validator');

var Category = require('../../models/category');

/**
 * List of categories
 *
 * @param req
 * @param res
 * @param next
 */
exports.index = async (req, res, next) => {
    var categories = await Category.find();

    res.render("admin/categories/index", {
        categories: categories
    });
};

/**
 * Create new category
 *
 * @param req
 * @param res
 * @param next
 */
exports.create = (req, res, next) => {
    var title = "";
    var slug = "";

    res.render('admin/categories/create', {
        title: title,
        slug: slug
    });
};

/**
 * Store category
 *
 * @param req
 * @param res
 * @param next
 */
exports.store = async (req, res, next) => {
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "")
        slug = title.replace(/\s+/g, '-').toLowerCase();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('admin/categories/create', {
            errors: errors.array(),
            title: title,
            slug: slug
        });
    }

    const category_is_exist = await Category.findOne({slug: slug});

    if(category_is_exist) {
        req.flash('danger', "Category slug is already exists");
        res.render('admin/categories/create', {
            title: title,
            slug: slug
        });
    }

    var category = new Category({title: title, slug: slug});

    try {
        await category.save();

        req.flash('success', "Category created successfully");

        res.redirect('/admin/categories');
    } catch(error) {
        req.flash('danger', "There is an error occurs");

        res.redirect('/admin/categories');
    }
};

/**
 * Edit existing category
 *
 * @param req
 * @param res
 * @param next
 */
exports.edit = async (req, res, next) => {
    var category = await Category.findOne({_id: req.params.category});

    if(! category) {
        req.flash('danger', "There is an error occurs");

        res.redirect('/admin/categories');
    }

    var title = category.title;
    var slug = category.slug;

    res.render('admin/categories/edit', {
        title: title,
        slug: slug,
        id: category._id
    });
};

/**
 * Update existing  category
 *
 * @param req
 * @param res
 * @param next
 */
exports.update = async (req, res, next) => {
    var category = await Category.findOne({_id: req.params.category});

    if(! category) {
        req.flash('danger', "There is an error occurs");

        res.redirect('/admin/categories');
    }

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "")
        slug = title.replace(/\s+/g, '-').toLowerCase();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('admin/categories/edit', {
            errors: errors.array(),
            title: title,
            slug: slug,
            id: category._id
        });
    }

    const category_is_exist = await Category.findOne({slug: slug, _id: {$ne: category._id}});

    if(category_is_exist) {
        req.flash('danger', "Category slug is already exists");
        res.render('admin/categories/edit', {
            title: title,
            slug: slug,
            id: category._id
        });
    }

    category.title = title;
    category.slug = slug;

    try {
        await category.save();

        req.flash('success', "Category created successfully");

        res.redirect('/admin/categories');
    } catch(error) {
        req.flash('danger', "There is an error occurs");

        res.redirect('/admin/categories');
    }
};

/**
 * Destroy existing  category
 *
 * @param req
 * @param res
 * @param next
 */
exports.destroy = async (req, res, next) => {
    try {

        var category = await Category.findOneAndDelete({_id: req.params.category});

        if(! category) {
            req.flash('danger', "There is an error occurs");

            res.redirect('/admin/categories');
        }

        req.flash('success', "Page deleted successfully");

        res.redirect('/admin/categories');
    } catch(error) {
        req.flash('danger', "There is an error occurs");

        res.redirect('/admin/categories');
    }
};