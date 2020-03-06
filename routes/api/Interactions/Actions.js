const mongoose      = require('mongoose');
const db            = mongoose.connection;
const jwt           = require('jsonwebtoken')
const key           = require('../../../config/keys.js')
const schema        = require('../../../models/WatchList.js')

// Valeur à mettre: imdbcode
const likeInteraction = (req, res) => {
    var imdbcode = req.params.id
    if (!req.cookies.token) { return res.sendStatus(403) }
    var userID = jwt.verify(req.cookies.token, key.secretOrKey).id
    if (!userID) { return res.sendStatus(403) }
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
    return res.sendStatus(200)
}

// Valeur à mettre = id
const watchList = (req, res) => {
    var imdbcode = req.params.id
    if (!req.cookies.token) { return res.sendStatus(403) }
    var userID = jwt.verify(req.cookies.token, key.secretOrKey).id
    if (!userID) { return res.sendStatus(403) }

    WatchList.findOne({ user_id: userID }, (err, data) => {
        if (!data) {
            var addList = new WatchList({
                user_id:   userID,
                movies: [ imdbcode ]
            })
            addList.save( (err) => { console.log(err) })
        } else {
            if (!data.movies.includes(imdbcode)) {
                data.movies.push(imdbcode)
            } else {
                data.movies = data.movies.filter(movies => movies != imdbcode)
            }
            data.save( (err) => { console.log(err) })
        }
        return res.sendStatus(200)
    })
}

// Valeur à mettre: id
const getWatchlist = (req, res) => {
    if (!req.cookies.token) { return res.sendStatus(403) }
    var userID = jwt.verify(req.cookies.token, key.secretOrKey).id
    if (!userID) { return res.sendStatus(403) }

    WatchList.findOne({ user_id: userID }, (err, data) => {
        if (!data) { return res.sendStatus(404) }
        else { res.json({ watchlist: data.movies }); }
    })
}

const Actions = (req, res) => {
    if (req.params.action == 'like') {
        likeInteraction(req, res)
    } else if (req.params.action == 'watchlist') {
        watchList(req, res)
    }
}

module.exports = { Actions, getWatchlist }