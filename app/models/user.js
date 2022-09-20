const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName1: {
        required: true,
        type: String
    },
    lastName2: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    classSection: {
        required: false,
        type: String
    },
    isAdmin: {
        required: true,
        type: Boolean
    },
    wantedCourses: {
        required: false,
        type: Array
    },
    proposedCourses: {
        required: false,
        type: Array
    }
})

module.exports = mongoose.model('User', userSchema)