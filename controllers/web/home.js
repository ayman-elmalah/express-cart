/**
 * Home page
 *
 * @param req
 * @param res
 * @param next
 */
exports.index = async (req, res, next) => {
    res.render('web/home/index', {
        title: "Home page"
    });
};