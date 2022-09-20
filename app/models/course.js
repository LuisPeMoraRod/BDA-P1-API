const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    category: {
        required: true,
        type: String
    },
    interestedStudents: {
        required: true,
        type: Number
    },
    proposedBy: {
        required: true,
        type: Object
    }
})

module.exports = mongoose.model('Course', courseSchema)