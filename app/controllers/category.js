const codes = require('http-status-codes');
const Category = require('../models/category');
const connStrings = require('../helpers/conn-strings');
const axios = require('axios');

const [replica1, replica2] = connStrings.setReplicaAPIs();

// retrieve category by name
exports.getCategory = async (req, res) => {
    try {
        const categoryName = req.params.category;
        const catData = await Category.find({ name: categoryName }, { _id: 0, name: 1 });
        res.status(codes.StatusCodes.OK).send(catData);
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// retrieve all registered categories
exports.getAllCategories = async (req, res) => {
    try {
        const catData = await Category.find({}, { _id: 0, name: 1 });
        res.status(codes.StatusCodes.OK).send(catData);
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// register new section
exports.newCategory = async (req, res) => {
    try {
        const categoryName = req.body.name;

        const isRedirected = req.query.isRedirected;
        if (!isRedirected) await redirectNewCategory(req.body); //redirect request to other APIs

        const category = new Category({
            name: categoryName,
        })

        const matchCategory = await Category.findOne({ name: categoryName }, { _id: 0, name: 1 }); // check if category is available
        if (!!matchCategory) res.status(codes.StatusCodes.BAD_REQUEST).json({ message: "Error: category already exists" });
        else {
            const savedCategory = await category.save(); //update DB
            res.status(codes.StatusCodes.OK).send(savedCategory);
        }
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const redirectNewCategory = async (category) => {
    try {
        await axios.post(replica1.concat("/categories?isRedirected=true"), category);
        await axios.post(replica2.concat("/categories?isRedirected=true"), category);
    } catch (error) {
        console.log(error);
    }

}