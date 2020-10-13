const express = require('express');
const router = express.Router();
const { getProductById, getProduct, getAllProducts, createProduct, updateProduct, removeProduct, photo, getAllUniqueCategory } = require('../controllers/product');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

// params
router.param('productId', getProductById);
router.param('userId', getUserById);

// get routes
router.get('/product/:productId', getProduct);
router.get('/product/photo/:productId', photo);

// get listing route
router.get('/products', getAllProducts);
router.get('/products/categories', getAllUniqueCategory);

// create route
router.post('/product/create/:userId', isSignedIn, isAuthenticated, isAdmin, createProduct);

// put route
router.put('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, updateProduct);

// delete route
router.delete('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, removeProduct);


module.exports = router;