const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    imdb_code: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    views: {
        default: 1,
        required: false,
        type: Number
    },
    like: {
        default: [],
        required: false,
        type: Array
    },
    comments: {
        default: [],
        required: false,
        type: Array
    },
    path: {
        required: false,
        type: Array
    },
    downloaded: {
        required: false,
        type: Array
    },
    lastView: {
        default: Date.now,
        required: false,
        type: Date
    },
    userViews: {
        default: [],
        required: false,
        type: Array
    }
});

module.exports = Movie = mongoose.model("Movie", movieSchema);