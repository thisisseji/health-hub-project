const User = require('../models/Users')
const TestResult = require('../models/TestResults')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all the users
// @route Get /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

// @desc Create a new user
// @route Post /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    // confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Username already exists' })
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { username, password: hashedPwd, roles }

    // create new user
    const user = await User.create(userObject)

    if (user) { // is created
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update a new user
// @route Patch /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body

    // confirm data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    // check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    // allow updates to the original user
    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.roles = roles
    user.active = active

    if (password) {
        // hash password
        user.password = await bcrypt.hash(password, 10) // salt rounds
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const testResult = await TestResult.findOne({ user: id }).lean().exec()
    if (testResult) {
        return res.status(409).json({ message: 'User has test results' })
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    // Save user details before deleting
    const username = user.username
    const userId = user._id

    await user.deleteOne()

    const reply = `Username ${username} with ID ${userId} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
}
