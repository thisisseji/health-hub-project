const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensure unique usernames
        trim: true    // Remove extra whitespace
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],        // Ensure roles are stored as an array
        default: ["Patient"]   // Default role is "Patient"
    },
    active: {
        type: Boolean,
        default: true          // User is active by default
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);
