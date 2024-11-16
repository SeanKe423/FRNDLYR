// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    interests: [{ type: String }],
    location: { type: String, default: '' },
    age: { type: Number, min: 18, max: 120 },
    profilePicture: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Add this method to the schema
UserSchema.methods.toJSON = function() {
    const obj = this.toObject();
    if (obj.profilePicture) {
        obj.profilePicture = `http://localhost:${process.env.PORT}/${obj.profilePicture}`;
    }
    return obj;
};

module.exports = mongoose.model('User', UserSchema);
