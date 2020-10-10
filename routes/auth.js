const express = require('express');
const router = express.Router();
const { signout, signup, signin } = require('../controllers/auth');
const { check } = require('express-validator');

router.post(
    '/signup', 
    [
        check('name', 'Name should be atleast of 3 chars').isLength({ min: 3}),
        check('email', 'Email is required').isEmail(),
        check('password', 'Password length must be at least 6 or more.').isLength({ min: 6 })
    ],
    signup
);

router.post(
    '/signin', 
    [
        check('email', 'Email is required').isEmail(),
        check('password', 'Password length must be at least 6 or more.').isLength({ min: 6 })
    ],
    signin
);


router.get('/signout', signout);

module.exports = router;