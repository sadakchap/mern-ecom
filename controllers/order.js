const { Order } = require('../models/order');

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
    .populate('products.product', 'name price')
    .exec((err, order) => {
        if(err){
            return res.status(400).json({ error: 'Can not get order bt Id!' });
        }
        req.order = order;
        next();
    });
};