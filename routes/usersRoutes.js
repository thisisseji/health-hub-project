const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Define routes for user operations
router.route('/')
    .get(usersController.getAllUsers)        // Retrieve all users
    .post(usersController.createNewUser)    // Create a new user
    .patch(usersController.updateUser)      // Update an existing user
    .delete(usersController.deleteUser);    // Delete a user

module.exports = router;
