const codes = require('http-status-codes');
const User = require('../models/user')


// authenticates user
exports.authUser = async (req, res) => {
    try {
        const email = req.params.email;
        const password = req.query.password;
        const registeredPwd = await User.findOne({ email: email });
        if (!registeredPwd) res.status(codes.StatusCodes.BAD_REQUEST).json({ message: "Error: email not registered" });
        else if (password !== registeredPwd.password) res.status(codes.StatusCodes.FORBIDDEN).json({ message: "Error: incorrect password" })
        else {
            const user = await User.findOne({ email: email }, { _id: 0, firstName: 1, lastName1: 1, lastName2: 1, email: 1, classSection: 1, wantedCourses: 1, proposedCourses: 1 })
            res.status(codes.StatusCodes.OK).json(user);
        }
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { _id: 0, firstName: 1, lastName1: 1, lastName2: 1, email: 1, classSection: 1, wantedCourses: 1, proposedCourses: 1 })
        res.status(codes.StatusCodes.OK).json(users);
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

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

        const matchUser = await User.findOne({ email: user.email });
        if (!!matchUser) res.status(codes.StatusCodes.BAD_REQUEST).json({ message: "Error: email already in use" }) // check if email is available
        else {
            const savedUser = await user.save(); //update DB
            res.status(codes.StatusCodes.OK).json(savedUser);
        }
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}