const TestResult = require('../models/TestResults');
const User = require('../models/Users');
const asyncHandler = require('express-async-handler');

// @desc Get all test results
// @route GET /test-results
// @access Private
const getAllTestResults = asyncHandler(async (req, res) => {
    const testResults = await TestResult.find().populate('user').populate('prescribedBy').lean();
    if (!testResults?.length) {
        return res.status(404).json({ message: 'No test results found' });
    }
    res.json(testResults);
});

// @desc Create a new test result
// @route POST /test-results
// @access Private
const createNewTestResult = asyncHandler(async (req, res) => {
    const { user, testName, result, status, prescribedBy, bloodTestCategory } = req.body;

    if (!user || !testName || !result || !prescribedBy) {
        return res.status(400).json({ message: 'User, test name, result, and prescribedBy are required' });
    }

    // Validate blood test category for blood tests
    if (testName === 'Blood test' && !bloodTestCategory) {
        return res.status(400).json({ message: 'Blood test category is required for blood tests' });
    }

    const testResult = await TestResult.create({
        user,
        testName,
        result,
        status,
        prescribedBy,
        bloodTestCategory: testName === 'Blood test' ? bloodTestCategory : undefined // Only set bloodTestCategory for Blood test
    });

    if (testResult) {
        res.status(201).json({ message: 'New test result created', testResult });
    } else {
        res.status(400).json({ message: 'Invalid test result data received' });
    }
});

// @desc Update a test result
// @route PATCH /test-results/:id
// @access Private
const updateTestResult = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { user, testName, result, status, prescribedBy, bloodTestCategory } = req.body;

    if (!id || !user || !testName || !result || !prescribedBy) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate blood test category for blood tests
    if (testName === 'Blood test' && !bloodTestCategory) {
        return res.status(400).json({ message: 'Blood test category is required for blood tests' });
    }

    const testResult = await TestResult.findById(id).exec();

    if (!testResult) {
        return res.status(404).json({ message: 'Test result not found' });
    }

    testResult.user = user;
    testResult.testName = testName;
    testResult.result = result;
    testResult.status = status;
    testResult.prescribedBy = prescribedBy;
    testResult.bloodTestCategory = testName === 'Blood test' ? bloodTestCategory : undefined;  // Only set for blood tests

    const updatedTestResult = await testResult.save();

    res.json({ message: 'Test result updated', testResult: updatedTestResult });
});

// @desc Delete a test result
// @route DELETE /test-results/:id
// @access Private
const deleteTestResult = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Test result ID required' });
    }

    const testResult = await TestResult.findById(id).exec();

    if (!testResult) {
        return res.status(404).json({ message: 'Test result not found' });
    }

    await testResult.deleteOne();

    res.json({ message: 'Test result deleted', id: testResult._id });
});

module.exports = {
    getAllTestResults,
    createNewTestResult,
    updateTestResult,
    deleteTestResult
};
