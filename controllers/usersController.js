const User = require('../models/Users');
const TestResult = require('../models/TestResults')
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean(); // Exclude password

    if (!users?.length) {
        return res.status(404).json({ message: 'No users found' });
    }

    res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles = ["Patient"] } = req.body;

    // Validate input
    if (!username || !password || !Array.isArray(roles)) {
        return res.status(400).json({ message: 'Invalid input. Please provide all required fields.' });
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).lean();
    if (duplicate) {
        return res.status(409).json({ message: 'Username already exists.' });
    }

    // Hash the password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Create user object
    const userObject = { username, password: hashedPwd, roles };

    // Save the user
    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({ message: `User ${username} created successfully.` });
    } else {
        res.status(500).json({ message: 'Failed to create user.' });
    }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body;

    if (!id || !username || !Array.isArray(roles) || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'Invalid input. Please provide all required fields.' });
    }

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).lean();
    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: 'Username already exists.' });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();
    res.json({ message: `User ${updatedUser.username} updated successfully.` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const result = await user.deleteOne();
    res.json({ message: `User ${user.username} with ID ${user._id} deleted successfully.` });
});

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
};
