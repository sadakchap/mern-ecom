const User = require('../models/user');
const { validationResult } = require('express-validator');

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
