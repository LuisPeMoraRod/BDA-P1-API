const codes = require('http-status-codes');
const Category = require('../models/category');

// retrieve category by name
exports.getCategory = async (req, res) => {
    try {
        const categoryName = req.params.category;
        const catData = await Category.find({ name: categoryName }, { _id: 0, name: 1 });
        res.status(codes.StatusCodes.OK).json(catData);
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// retrieve all registered categories
exports.getAllCategories = async (req, res) => {
    try {
        const catData = await Category.find({}, { _id: 0, name: 1 });
        res.status(codes.StatusCodes.OK).json(catData);
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// register new section
exports.newCategory = async (req, res) => {
    try {
        const categoryName = req.body.name;
        const category = new Category({
            name: categoryName,
        })

        const matchCategory = await Category.findOne({ name: categoryName }, { _id: 0, name: 1 }); // check if category is available
        if (!!matchCategory) res.status(codes.StatusCodes.BAD_REQUEST).json({ message: "Error: category already exists" });
        else {
            const savedCategory = await category.save(); //update DB
            res.status(codes.StatusCodes.OK).json(savedCategory);
        }
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}