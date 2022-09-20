const codes = require('http-status-codes');
const Course = require('../models/course');
const User = require('../models/user');

exports.newCourse = async (req, res) => {
    try {
        const courseName = req.body.name;
        const email = req.body.proposedByEmail;
        const proposedBy = await User.findOne({ email: email }, { _id: 0, firstName: 1, lastName1: 1, lastName2: 1, email: 1, classSection: 1 });

        if (!proposedBy) {
            res.status(codes.StatusCodes.BAD_REQUEST).json({ message: "Error: user not found" });
            return;
        }

        const newCourse = new Course({
            name: courseName,
            category: req.body.category,
            interestedStudents: 0,
            proposedBy: proposedBy
        })

        const matchCourse = await Course.findOne({ name: courseName });
        if (!!matchCourse) res.status(codes.StatusCodes.BAD_REQUEST).json({ message: "Error: course already exists" }); // check if course name is available
        else {
            const savedCourse = await newCourse.save(); // update db
            res.status(codes.StatusCodes.OK).json(savedCourse);
        }
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);

    }
}