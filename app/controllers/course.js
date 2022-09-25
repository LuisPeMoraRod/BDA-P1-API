const codes = require('http-status-codes');
const Course = require('../models/course');
const User = require('../models/user');
const connStrings = require('../helpers/conn-strings');
const axios = require('axios');
const subscribe = 'subscribe';
const unsubscribe = 'unsubscribe'


const [replica1, replica2] = connStrings.setReplicaAPIs();

/**
 * Checks if course is part of user's wantedCourses
 * @param {Array} wantedCourses 
 * @param {String} courseName 
 * @returns boolean
 */
const hasInterest = (wantedCourses, courseName) => {
    let interested = false;
    wantedCourses.forEach((course) => {
        if (course.name === courseName) interested = true;
    })
    return interested;
};

/**
 * Checks if user is owner of course
 * @param {Array} wantedCourses 
 * @param {String} courseName 
 * @returns boolean
 */
const isOwner = (proposedCourses, courseName) => {
    let isOwner = false;
    proposedCourses.forEach((course) => {
        if (course.name === courseName) isOwner = true;
    })
    return isOwner;
}

// retrieve course by name
exports.getCourse = async (req, res) => {
    try {
        const name = req.params.course;
        const courseData = await Course.find({ name: name }, { _id: 0, name: 1, category: 1, interestedStudents: 1, proposedBy: 1 });
        res.status(codes.StatusCodes.OK).send(courseData);
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

// retrieve all registered courses
exports.getAllCourses = async (req, res) => {
    try {
        const coursesData = await Course.find({}, { _id: 0, name: 1, category: 1, interestedStudents: 1, proposedBy: 1 });
        res.status(codes.StatusCodes.OK).send(coursesData);
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

//register new course
exports.newCourse = async (req, res) => {
    try {
        // get json body values
        const courseName = req.body.name;
        const email = req.body.proposedByEmail;

        const isRedirected = req.query.isRedirected;
        if (!isRedirected) await redirectNewCourse(req.body); //redirect request to other APIs

        // check if email is registered
        const proposedBy = await User.findOne({ email: email }, { _id: 0, firstName: 1, lastName1: 1, lastName2: 1, email: 1, classSection: 1 });

        if (!proposedBy) {
            res.status(codes.StatusCodes.BAD_REQUEST).send({ message: "Error: user not found" });
            return;
        }

        const newCourse = new Course({
            name: courseName,
            category: req.body.category,
            interestedStudents: 1,
            proposedBy: proposedBy
        })

        // check if course name is available
        const matchCourse = await Course.findOne({ name: courseName });
        if (!!matchCourse) res.status(codes.StatusCodes.BAD_REQUEST).json({ message: "Error: course name already in use" });
        else {
            await newCourse.save(); // add new course
            const course = await Course.findOne({ name: courseName }, { name: 1, category: 1 });
            await User.updateOne({ email: email }, { $push: { proposedCourses: course } }) // add course to user's profile
            const coursesData = await Course.find({}, { _id: 0, name: 1, category: 1, interestedStudents: 1, proposedBy: 1 });
            const user = await User.findOne({ email: email }, { _id: 0, firstName: 1, lastName1: 1, lastName2: 1, email: 1, classSection: 1, wantedCourses: 1, proposedCourses: 1 })
            res.status(codes.StatusCodes.OK).send({ user: user, courses: coursesData });
        }
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);

    }
}

const redirectNewCourse = async (course) => {
    try {
        // const options = {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(course),
        //     credentials: 'same-origin'
        // }

        const response1 = await axios.post(replica1.concat("/courses?isRedirected=true"), course);
        // const response1 = await axios.get("https://swapi.dev/api/people/1");
        console.log(response1)
        // const response2 = await fetch(replica2.concat("/courses?isRedirected=true"), options);
    } catch (error) {
        console.log(error);
    }

}

//handle course subscription
exports.handleSubscription = async (req, res) => {
    try {
        // get query params
        const action = req.query.action; //subscribe or unsubscribe
        const email = req.query.email;
        const courseName = req.params.courseName;

        // check if email is registered
        const user = await User.findOne({ email: email }, { _id: 0, email: 1, wantedCourses: 1, proposedCourses: 1 });
        if (!user) {
            res.status(codes.StatusCodes.BAD_REQUEST).json({ message: "Error: user not found" });
            return;
        }

        if (!isOwner(user.proposedCourses, courseName)) {
            res.status(codes.StatusCodes.BAD_REQUEST).json({ message: "Error: user proposed the course, cannot subscribe or unsubscribe" });
            return;
        }

        if (action === subscribe && !hasInterest(user.wantedCourses, courseName)) {
            await Course.updateOne({ name: courseName }, { $inc: { interestedStudents: 1 } }); //increment interested students counter

            const course = await Course.findOne({ name: courseName }, { name: 1, category: 1 });
            await User.updateOne({ email: email }, { $push: { wantedCourses: course } }) // add course to user's profile

            const coursesData = await Course.find({}, { _id: 0, name: 1, category: 1, interestedStudents: 1, proposedBy: 1 });
            const userUpdated = await User.findOne({ email: email }, { _id: 0, firstName: 1, lastName1: 1, lastName2: 1, email: 1, classSection: 1, wantedCourses: 1, proposedCourses: 1 })

            res.status(codes.StatusCodes.OK).json({ user: userUpdated, courses: coursesData });
            return;
        } else if (action === subscribe && hasInterest(user.wantedCourses, courseName)) {
            res.status(codes.StatusCodes.BAD_REQUEST).json({ message: "Error: user was already interested in course" });
            return;
        } else if (action === unsubscribe && hasInterest(user.wantedCourses, courseName)) {
            await Course.updateOne({ name: courseName }, { $inc: { interestedStudents: -1 } }); //increment interested students counter

            const course = await Course.findOne({ name: courseName }, { name: 1, category: 1 });
            await User.updateOne({ email: email }, { $pull: { wantedCourses: { name: courseName } } }) // add course to user's profile

            const coursesData = await Course.find({}, { _id: 0, name: 1, category: 1, interestedStudents: 1, proposedBy: 1 });
            const userUpdated = await User.findOne({ email: email }, { _id: 0, firstName: 1, lastName1: 1, lastName2: 1, email: 1, classSection: 1, wantedCourses: 1, proposedCourses: 1 })

            res.status(codes.StatusCodes.OK).json({ user: userUpdated, courses: coursesData });
            return;
        } else if (action === unsubscribe && !hasInterest(user.wantedCourses, courseName)) {
            res.status(codes.StatusCodes.BAD_REQUEST).json({ message: "Error: user wasn't interested in course" });
            return;
        }

    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);

    }
};
