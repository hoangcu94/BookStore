const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { 
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    passwordHash: {
        type: String,
        required:true
    },
    phoneNumber: {
        type: String,
        required:true
    },
    role: {
        type: String,
        required:true
    },
    street: {
        type: String,
        required:true
    },
    city: {
        type: String,
        required:true
    },
    country: {
        type: String,
        required:true
    },
    avatar: {
        type: String,
        required:true
    },

});

module.exports = mongoose.model('user', UserSchema);