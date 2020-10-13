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

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err, savedOrder) => {
        if(err || !savedOrder){
            return res.status(400).json({ error: 'Can not crete new order!' });
        }
        return res.status(200).json(savedOrder);
    });
};

