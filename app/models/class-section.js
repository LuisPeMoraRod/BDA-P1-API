const mongoose = require('mongoose');

const classSectionSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('ClassSection', classSectionSchema)