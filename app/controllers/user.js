const codes = require('http-status-codes');
const User = require('../models/user')


// authenticates user
exports.authUser = async (req, res) => {
    try {
        res.send("Authenticate user")   
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR).send(error.messsage);
    }
}

// register new user
exports.newUser = async (req, res) => {
    try {
        const user = new User({
            firstName: req.body.firstName,
            lastName1: req.body.lastName1,
            lastName2: req.body.lastName2,
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.isAdmin,
        })

        if (req.body.classSection) user.classSection = req.body.classSection; // optional field

        const savedUser = await user.save(); //update DB
        res.status(codes.StatusCodes.OK).json(savedUser);
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.messsage});
    }
}