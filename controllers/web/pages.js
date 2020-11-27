var Page = require('../../models/page');

/**
 * Show page
 *
 * @param req
 * @param res
 * @param next
 */
exports.show = async (req, res, next) => {
    var slug = req.params.page;

    var page = await Page.findOne({slug: slug});

    if(! page) {
        res.redirect('/');
    }

    res.render('web/pages/show', {
        title: page.title,
        page: page
    });
};