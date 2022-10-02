const express = require('express');

// initialize router
const router = express.Router();
const user = require('../controllers/user')
const section = require('../controllers/class-section');
const category = require('../controllers/category');
const course = require('../controllers/course');

// GET methods
router.get('/users', user.getAllUsers)// Get all users
router.get('/users/:email', user.authUser); // Auth user
router.get('/class-sections', section.getAllSections); // Get all sections
router.get('/class-sections/:section', section.getSection); // Get section by name
router.get('/categories', category.getAllCategories); // Get all categories
router.get('/categories/:category', category.getCategory); // Get section by name
router.get('/courses/:course', course.getCourse); // Get course by name
router.get('/courses', course.getAllCourses); // Get all courses
router.get('/report/topCourses', course.getTopFiveCourses); // Get top five courses
router.get('/report/bottomCourses', course.getBottomFiveCourses); // Get bottom five courses
router.get('/report/byCategory', course.getByCategory); // Get courses by category
router.get('/report/topSuggesters', course.getTopSuggesters); // Get top three suggesters 

// POST methods
router.post('/users', user.newUser); // Register new user
router.post('/class-sections', section.newSection); // Register new section
router.post('/categories', category.newCategory); // Register new category
router.post('/courses', course.newCourse); // Register new course

// PATCH/PUT methods
router.patch('/courses/:courseName', course.handleSubscription); // Subscribe or unsubcribe user from course

module.exports = router;