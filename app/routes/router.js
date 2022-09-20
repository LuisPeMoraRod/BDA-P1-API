const express = require('express');

// initialize router
const router = express.Router();
const user = require('../controllers/user')
const section = require('../controllers/class-section');
const category = require('../controllers/category');
const course = require('../controllers/course');

// GET methods
router.get('/users/authenticate', user.authUser); // Auth user
router.get('/class-sections/all', section.getAllSections); // Get all sections
router.get('/class-sections/:section', section.getSection); // Get section by name
router.get('/categories/all', category.getAllCategories); // Get all categories
router.get('/categories/:category', category.getCategory); // Get section by name

// POST methods
router.post('/users/register', user.newUser); // Register new user
router.post('/class-sections/register', section.newSection); // Register new section
router.post('/categories/register', category.newCategory); // Register new category
router.post('/courses/register', course.newCourse);

module.exports = router;