var express = require('express');

var router = express.Router();

var Auth = require('../config/auth');

var PagesController = require('../controllers/admin/pages');
var CategoriesController = require('../controllers/admin/categories');
var ProductsController = require('../controllers/admin/products');

var PagesStoreValidator = require('../validators/admin/pages/store');
var PagesUpdateValidator = require('../validators/admin/pages/update');

var CategoriesStoreValidator = require('../validators/admin/categories/store');
var CategoriesUpdateValidator = require('../validators/admin/categories/update');

var ProductsStoreValidator = require('../validators/admin/products/store');
var ProductsUpdateValidator = require('../validators/admin/products/update');

// Page resource
router.get('/pages', Auth.isAdmin, PagesController.index);
router.get('/pages/create', Auth.isAdmin, PagesController.create);
router.post('/pages/store', Auth.isAdmin, PagesStoreValidator.validate, PagesController.store);
router.get('/pages/:page/edit', Auth.isAdmin, PagesController.edit);
router.post('/pages/:page/update', Auth.isAdmin, PagesUpdateValidator.validate, PagesController.update);
router.post('/pages/:page/destroy', Auth.isAdmin, PagesController.destroy);
router.post('/pages/reorder', Auth.isAdmin, PagesController.reOrder);

// Category resource
router.get('/categories', Auth.isAdmin, CategoriesController.index);
router.get('/categories/create', Auth.isAdmin, CategoriesController.create);
router.post('/categories/store', Auth.isAdmin, CategoriesStoreValidator.validate, CategoriesController.store);
router.get('/categories/:category/edit', Auth.isAdmin, CategoriesController.edit);
router.post('/categories/:category/update', Auth.isAdmin, CategoriesUpdateValidator.validate, CategoriesController.update);
router.post('/categories/:category/destroy', Auth.isAdmin, CategoriesController.destroy);

// Product resource
router.get('/products', Auth.isAdmin, ProductsController.index);
router.get('/products/create', Auth.isAdmin, ProductsController.create);
router.post('/products/store', Auth.isAdmin, ProductsStoreValidator.validate, ProductsController.store);
router.get('/products/:product/edit', Auth.isAdmin, ProductsController.edit);
router.post('/products/:product/update', Auth.isAdmin, ProductsUpdateValidator.validate, ProductsController.update);
router.post('/products/:product/destroy', Auth.isAdmin, ProductsController.destroy);

module.exports = router;