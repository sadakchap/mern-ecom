const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { sortBy } = require('lodash');

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
        if(err || !product){
            return res.status(400).json({
                error: 'Could not find the product by ID'
            });
        }
        req.product = product;
        next();
    });
};

exports.getProduct = (req, res) => {
    res.product.photo = undefined;
    return res.json(req.product);
};

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
    .select('-photo')
    .populate("category")
    .sort([[sortBy, "asc"]])  // .sort([["createdAt", "asc"]])
    .limit(limit)
    .exec((err, products) => {
        if(err || !products){
            return res.status(404).json({
                error: 'No products in DB!'
            });
        }
        return res.status(200).json(products);
    });
};

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: `problem with image: ${err.message}`
            });
        }
        const { name, price, desc, stock, category } = fields;
        if(!name || !price || !desc || !stock || !category){
            return res.status(400).json({ error: 'please provide all fields '});
        }
        
        // TODO: restrictions on fields
        let product = new Product(fields);

        // handle file
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({ error: 'file size too big' });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // saving product
        product.save((err, savedProduct) => {
            if(err || !savedProduct){
                return res.status(400).json({ error: 'saving product in DB failed' });
            }
            return res.status(200).json(savedProduct);
        });

    });
};

exports.updateProduct = (req, res) => {   
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: `problem with image: ${err.message}`
            });
        }
        
        let product = req.product;
        product = _.extend(product, fields);

        // handle file
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({ error: 'file size too big' });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // saving product
        product.save((err, updatedProduct) => {
            if(err || !updatedProduct){
                return res.status(400).json({ error: 'updation of product in DB failed' });
            }
            return res.status(200).json(updatedProduct);
        });

    });
};

exports.removeProduct = (req, res) => {
    const product = req.product;
    product.remove((err, removedProduct) => {
        if(err){
            return res.status(400).json({ error: 'Cannot remove the product' });
        }
        return res.status(200).json({ message: `${removedProduct.name} Product removed successfully!` });
    });
};

exports.getAllUniqueCategory = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if(err){
            return res.status(400).json({ error: 'No category found!' });
        }
        return res.status(200).json(category)
    })
}

// middleware
exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(product => {
        return {
            updateOne: {
                filter: { _id: product._id }
            },
            update: {$inc: {stock: -product.count, sold: +product.count} }
        }
    });

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err){
            return res.status(400).json({ error: 'Bulk operations failed!' });
        }
        next();
    })
};


// other way of storing photos -
// 1) store images in firebase/s3 bucket
// 2) then, in model field store its url string
// Note: for more info watch https://www.youtube.com/watch?v=srPXMt1Q0nY&list=LL&index=1