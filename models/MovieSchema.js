const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    imdbid: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    title:{
        type: [ String ],
        required: true,
    },
    overview:{
        type: [ String ],
        required: true,
    },
    rating:{
        type: Number,
        required: true,
    },
    poster:{
        type: [ String ],
        default: 'https://m.media-amazon.com/images/G/01/imdb/images/nopicture/large/film-184890147._CB466725069_.png',
        required: true,
    },
    productionYear:{
        type: Number,
        maxlength: 4,
        required: true,
    },
    genres: {
        default: [],
        required: false,
        type: [ String ]
    },
    views: {
        default: 1,
        required: false,
        type: Number
    },
    like: {
        default: [],
        required: false,
        type: [ String ]
    },
    comments: {
        default: [],
        required: false,
        type: [ String ]
    }
});

module.exports = Movie = mongoose.model("Movie", movieSchema);