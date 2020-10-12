const Category = require('../models/category');

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category){
            return res.status(400).json({
                error: 'Cannot get category by ID'
            });
        }
        console.log('from params route', category);
        req.category = category;
        next();
    });
};

//TODO: check for unique category name
exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if(err){
            return res.status(400).json({
                error: 'Could not save category'
            });
        }
        return res.status(200).json({ category });
    });
};

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, updatedCategory) => {
        if(err || !updatedCategory){
            return res.status(400).json({
                error: 'Can not update the category'
            });
        }
        return res.status(200).json(updatedCategory);
    });
};

exports.removeCategory = (req, res) => {
    const category = req.category;
    category.remove((err, removedCategory) => {
        if(err || !removedCategory){
            return res.status(400).json({
                error: `can not remove ${removedCategory.name} category!`
            });
        }
        return res.status(200).json({
            message: `Successfully deleted ${removedCategory.name} category!`
        });
    });
};

exports.getCategory = (req, res) => {
    return res.status(200).json(req.category);
};

exports.getAllCategories = (req, res) => {
    Category.find().exec((err, categories) => {
        if(err || !categories){
            return res.status(400).json({
                error: 'No categories found!'
            });
        }
        return res.status(200).json(categories);
    });
};