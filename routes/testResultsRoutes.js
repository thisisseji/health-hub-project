const express = require('express');
const router = express.Router();
const testResultsController = require('../controllers/testResultsController');

router.route('/')
    .get(testResultsController.getAllTestResults)
    .post(testResultsController.createNewTestResult);  // Ensure the controller handles validation here

router.route('/:id')
    .patch(testResultsController.updateTestResult)  // Handle update logic and validation in the controller
    .delete(testResultsController.deleteTestResult);

module.exports = router;
