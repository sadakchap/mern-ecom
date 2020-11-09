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
            console.log(err);
            return res.status(400).json({ error: 'Can not crete new order!' });
        }
        return res.status(200).json(savedOrder);
    });
};

exports.getAllOrders = (req, res) => {
    Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
        if(err || !orders){
            return res.status(400).json({ error: 'no orders in DB'} );
        }
        res.status(200).json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
    return res.json(Order.schema.path('status').enumValues);
};

exports.updateOrderStatus = (req, res) => {
    Order.update(
        {_id: req.body.order._id},
        {$set: {status: req.body.status}},
        (err, order) => {
            if(err){
                return res.status(400).json({ error: 'cannot update order status' });
            }
            return res.json(order);
        }
    );
};;