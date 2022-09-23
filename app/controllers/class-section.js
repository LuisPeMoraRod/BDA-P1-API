const codes = require('http-status-codes');
const ClassSection = require('../models/class-section')


// retrieve section by name
exports.getSection = async (req, res) => {
    try {
        const sectionName = req.params.section;
        const sectData = await ClassSection.find({ name: sectionName }, { _id: 0, name: 1 });
        res.status(codes.StatusCodes.OK).json(sectData);
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// retrieve all registered sections
exports.getAllSections = async (req, res) => {
    try {
        const resData = await ClassSection.find({}, { _id: 0, name: 1 });
        res.status(codes.StatusCodes.OK).json(resData);
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

// register new section
exports.newSection = async (req, res) => {
    try {
        const sectionName = req.body.name;
        const classSection = new ClassSection({
            name: sectionName,
        })

        const matchSection = await ClassSection.findOne({ name: sectionName }, { _id: 0, name: 1 }); // check if section is available
        if (!!matchSection) res.status(codes.StatusCodes.BAD_REQUEST).json({ message: "Error: Section already exists" });
        else {
            const savedSection = await classSection.save(); //update DB
            res.status(codes.StatusCodes.OK).json(savedSection);
        }
    } catch (error) {
        res.status(codes.StatusCodes.INTERNAL_SERVER_ERROR);
    }
}