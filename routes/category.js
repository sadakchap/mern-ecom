const express = require('express');
const router = express.Router();
const { getCategoryById, createCategory, updateCategory, removeCategory, getCategory, getAllCategories } = require('../controllers/category');
const { getUserById } = require('../controllers/user');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');

// params
router.param('userId', getUserById);
router.param('categoryId', getCategoryById);

// get routes
router.get('/category/:categoryId', getCategory);
router.get('/categories', getAllCategories);

// create route
router.post('/category/create/:userId', isSignedIn, isAuthenticated, isAdmin, createCategory);

// put route
router.put('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, updateCategory);
router.delete('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, removeCategory);

module.exports = router;