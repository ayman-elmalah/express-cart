const { validationResult } = require('express-validator');

var Page = require('../../models/page');

/**
 * List of pages
 *
 * @param req
 * @param res
 * @param next
 */
exports.index = async (req, res, next) => {
    var pages = await Page.find().sort({sorting: 1}).exec();

    res.render("admin/pages/index", {
        pages: pages
    });
};

/**
 * Create new page
 *
 * @param req
 * @param res
 * @param next
 */
exports.create = (req, res, next) => {
    var title = "";
    var slug = "";
    var content = "";

    res.render('admin/pages/create', {
        title: title,
        slug: slug,
        content: content
    });
};

/**
 * Store page
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
    var content = req.body.content;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('admin/pages/create', {
            errors: errors.array(),
            title: title,
            slug: slug,
            content: content
        });
    }

    const page_is_exist = await Page.findOne({slug: slug});

    if(page_is_exist) {
        req.flash('danger', "Page slug is already exists");
        res.render('admin/pages/create', {
            title: title,
            slug: slug,
            content: content
        });
    }

    var page = new Page({title: title, slug: slug, content: content, sorting: 0});

    try {
        await page.save();

        req.flash('success', "Page created successfully");

        res.redirect('/admin/pages');
    } catch(error) {
        req.flash('danger', "There is an error occurs");

        res.redirect('/admin/pages');
    }
};

/**
 * Edit existing page
 *
 * @param req
 * @param res
 * @param next
 */
exports.edit = async (req, res, next) => {
    var page = await Page.findOne({_id: req.params.page});

    if(! page) {
        req.flash('danger', "There is an error occurs");

        res.redirect('/admin/pages');
    }

    var title = page.title;
    var slug = page.slug;
    var content = page.content;

    res.render('admin/pages/edit', {
        title: title,
        slug: slug,
        content: content,
        id: page._id
    });
};

/**
 * Update existing  page
 *
 * @param req
 * @param res
 * @param next
 */
exports.update = async (req, res, next) => {
    var page = await Page.findOne({_id: req.params.page});

    if(! page) {
        req.flash('danger', "There is an error occurs");

        res.redirect('/admin/pages');
    }

    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "")
        slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('admin/pages/edit', {
            errors: errors.array(),
            title: title,
            slug: slug,
            content: content,
            id: page._id
        });
    }

    const page_is_exist = await Page.findOne({slug: slug, _id: {$ne: page._id}});

    if(page_is_exist) {
        req.flash('danger', "Page slug is already exists");
        res.render('admin/pages/edit', {
            title: title,
            slug: slug,
            content: content,
            id: page._id
        });
    }

    page.title = title;
    page.slug = slug;
    page.content = content;

    try {
        await page.save();

        req.flash('success', "Page created successfully");

        res.redirect('/admin/pages');
    } catch(error) {
        req.flash('danger', "There is an error occurs");

        res.redirect('/admin/pages');
    }
};

/**
 * Destroy existing  page
 *
 * @param req
 * @param res
 * @param next
 */
exports.destroy = async (req, res, next) => {
    try {

        var page = await Page.findOneAndDelete({_id: req.params.page});

        if(! page) {
            req.flash('danger', "There is an error occurs");

            res.redirect('/admin/pages');
        }

        req.flash('success', "Page deleted successfully");

        res.redirect('/admin/pages');
    } catch(error) {
        req.flash('danger', "There is an error occurs");

        res.redirect('/admin/pages');
    }
};

/**
 * Re order page
 *
 * @param req
 * @param res
 * @param next
 */
exports.reOrder = async (req, res, next) => {
    var ids = req.body['id[]'];

    sortPages(ids, function () {
        Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.pages = pages;
            }
        });
    });
};

// Sort pages function
function sortPages(ids, callback) {
    var count = 0;

    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++;

        (function (count) {
            Page.findById(id, function (err, page) {
                page.sorting = count;
                page.save(function (err) {
                    if (err)
                        return console.log(err);
                    ++count;
                    if (count >= ids.length) {
                        callback();
                    }
                });
            });
        })(count);

    }
}