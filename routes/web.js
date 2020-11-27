var express = require('express');

var router = express.Router();

var HomeController = require('../controllers/web/home');
var PagesController = require('../controllers/web/pages');
var ProductsController = require('../controllers/web/products');
var CartController = require('../controllers/web/cart');

router.get('/', HomeController.index);

router.get('/pages/:page', PagesController.show);

router.get('/products', ProductsController.index);
router.get('/products/:category/products', ProductsController.categoryProducts);
router.get('/products/:product', ProductsController.show);

router.post('/cart/:product/add-to-cart', CartController.addToCart);
router.get('/cart/:product/update', CartController.updateCart);
router.get('/cart/clear', CartController.clearCart);
router.get('/cart/checkout', CartController.checkout);
router.get('/cart/buynow', CartController.buyNow);

module.exports = router;