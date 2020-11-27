var Product = require('../../models/product');

/**
 * Add to cart
 *
 * @param req
 * @param res
 * @param next
 */
exports.addToCart = async (req, res, next) => {
    var id = req.params.product;

    var product = await Product.findOne({_id: id});

    if(! product) {
        res.redirect('/');
    }

    var product_image = '';
    if(product.image == "") {
        product_image = "/defaults/images/product.png";
    } else {
        product_image ="/uploads/images/products/"+product._id+"/"+product.image;
    }

    if (typeof req.session.cart == "undefined") {
        req.session.cart = [];
        req.session.cart.push({
            id: product._id,
            title: product.title,
            qty: 1,
            price: parseFloat(product.price).toFixed(2),
            image: product_image
        });
    } else {
        var cart = req.session.cart;
        var newItem = true;

        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id == id) {
                cart[i].qty++;
                newItem = false;
                break;
            }
        }

        if (newItem) {
            cart.push({
                id: product._id,
                title: product.title,
                qty: 1,
                price: parseFloat(product.price).toFixed(2),
                image: product_image
            });
        }
    }

    req.flash('success', 'Product added!');
    res.redirect('back');
};

/**
 * Update cart
 *
 * @param req
 * @param res
 * @param next
 */
exports.updateCart = async (req, res, next) => {
    var id = req.params.product;
    var cart = req.session.cart;
    var action = req.query.action;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if (cart[i].qty < 1)
                        cart.splice(i, 1);
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0)
                        delete req.session.cart;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }

    req.flash('success', 'Cart updated!');
    res.redirect('/cart/checkout');
};

/**
 * Clear cart
 *
 * @param req
 * @param res
 * @param next
 */
exports.clearCart = async (req, res, next) => {
    delete req.session.cart;

    req.flash('success', 'Cart cleared!');
    res.redirect('/cart/checkout');
};


/**
 * Cart page
 *
 * @param req
 * @param res
 * @param next
 */
exports.checkout = async (req, res, next) => {
    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/cart/checkout');
    } else {
        res.render('web/cart/checkout', {
            title: 'Checkout',
            cart: req.session.cart
        });
    }
};

/**
 * But now
 *
 * @param req
 * @param res
 * @param next
 */
exports.buyNow = async (req, res, next) => {
    delete req.session.cart;

    res.sendStatus(200);
};