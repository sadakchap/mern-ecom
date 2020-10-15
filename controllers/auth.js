const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signin = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const customErrorArray = [];
        errors.array().forEach(err => {
            customErrorArray.push({ name: err.param, msg: err.msg });
        });
        return res.status(400).json({ errors: customErrorArray });
    }
    
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "Email is not registered YET!"
            });
        }

        if(!user.authenticate(password)){
            return res.status(400).json({
                error: "Email and password do not match!"
            });
        }

        // payload = { _id: user._id } // payload { user: user._id }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie("token", token, {
            // httpOnly: true,
            // maxAge: 24 * 60 * 60
            expire: new Date() + 9999
        });
        const { _id, name, email, role } = user;
        return res.status(200).json({
            token,
            user: {
                _id,
                name,
                email, 
                role
            }
        });
    });

    
};

// add check for unique email validation
exports.signup = (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const customErrorArray = [];
        errors.array().forEach(err => {
            customErrorArray.push({ name: err.param, msg: err.msg });
        });
        return res.status(400).json({ error: customErrorArray });
    }
    
    // check for unique email
    User.findOne({ email: req.body.email }).exec((err, user) => {
        if(err){
            return res.status(400).json({
                error: 'Error while checking for duplicate email'
            });
        }
        
        if(user){
            console.log(`user already exists ${user.email}`);
            return res.status(400).json({
                error: 'Sorry, this email is already taken.'
            })
        }else{
            const user = new User(req.body);
            user.save((err, user) => {
                if(err){
                    return res.status(400).json({
                        error: err.message
                    });
                }
                return res.status(200).json({
                    name: user.name,
                    email: user.email,
                    id: user._id
                });
            });
        }
    });

};

// clearing the cookies
exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "User Signout"
    });
};

// isLoggedIn
exports.isSignedIn = expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'], userProperty: 'auth' })

// middlewares
exports.isAuthenticated = (req, res, next) => {
    if(req.profile && req.auth && req.profile._id == req.auth._id){
        next();
    }else{
        return res.status(403).json({
            error: 'Access Denied!'
        });
    }
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: 'You are NOT Admin!'
        });
    }
    next();
};
