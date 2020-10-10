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
        return res.status(400).json({ errors: customErrorArray });
    }
    
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
};

exports.signout = (req, res) => {
    res.json({
        message: "User Signout"
    });
};
