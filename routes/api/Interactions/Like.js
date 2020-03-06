const mongoose      = require('mongoose');
const db            = mongoose.connection;
const jwt           = require('jsonwebtoken')
const key           = require('../../../config/keys.js')

const likeInteraction = (req, res, imdbcode) => {
    if (!req.cookies.token) {
        res.sendStatus(403)
        return ;
    }
    var userID = jwt.verify(req.cookies.token, key.secretOrKey).id
    if (!userID) {
        res.sendStatus(403)
        return ;
    }
    Movie.findOne({ imdb_code: imdbcode }, (err, data) => {
        if (!data)
            res.sendStatus(403)
        if (!data.like.includes(userID)) {
            data.like.push(userID)
        } else {
            data.like = data.like.filter(like => like != userID)
        }
        data.save( (err) => { console.log(err) })
    })
    res.sendStatus(200)
}

module.exports = { likeInteraction }