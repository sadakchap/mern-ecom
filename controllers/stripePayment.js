const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');

exports.makeStripePayment = (req, res) => {
    const { products, token } = req.body;
    let totalAmount = 0;
    totalAmount = products.reduce((amount, prod) => amount + parseInt(prod.price), 0);
    console.log(totalAmount);
    const idempotencyKey = uuidv4();

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: totalAmount * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email
        }, { idempotencyKey }).then(result => {
            // console.log(result);
            return res.status(200).json(result);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Sorry, something went really wrong!'
            })
        })
    });
}