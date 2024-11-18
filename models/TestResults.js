const mongoose = require('mongoose');

// Blood test categories enum
const bloodTestCategories = [
    'Routine hematology',
    'Coagulation',
    'Routine chemistry',
    'Renal function',
    'Liver function',
    'Pancreas function',
    'Endocrinology',
    'Tumor marker'
];

// Test types enum
const testTypes = [
    'Blood test',
    'Urine test',
    'Ultrasound',
    'X-ray',
    'CT scan',
    'ECG'
];

const testResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    testName: {
        type: String,
        required: true,
        enum: testTypes, // Ensure the test name is one of the valid types
    },
    bloodTestCategory: {
        type: String,
        enum: bloodTestCategories, // Only applicable if the test is a blood test
        required: function() {
            return this.testName === 'Blood test'; // Only required for blood tests
        }
    },
    result: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Reviewed'],
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now
    },
    prescribedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', // Reference to the doctor who prescribed the test
        required: true
    },
}, {
    timestamps: true
});

// Model
module.exports = mongoose.model('TestResult', testResultSchema);
