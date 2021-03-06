const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

// ProductCartSchema is like OrderItem ORR items(product) that are in the cart/order
const ProductCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    count: Number,
    price: Number
});

const orderSchema = new mongoose.Schema({
    products: [ProductCartSchema],
    transaction_id: {},
    amount: Number,
    address: String,
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        default: 'Recieved',
        enum: ['Cancelled', 'Delivered', 'Shipped', 'Processing', 'Recieved']
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
const productCart = mongoose.model("ProductCart", ProductCartSchema);

module.exports = {
    Order,
    productCart
};
