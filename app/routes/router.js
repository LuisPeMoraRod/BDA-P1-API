const express = require('express');

// initialize router
const router = express.Router();
const user = require('../controllers/user')

// GET methods
router.get('/users/authenticate', user.authUser);

// POST methods
// Register new user
router.post('/users/new', user.newUser);


module.exports = router;