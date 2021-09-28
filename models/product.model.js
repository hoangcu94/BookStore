const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BookSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    author: {
        type: String,
        required:true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required:true
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('book', BookSchema);