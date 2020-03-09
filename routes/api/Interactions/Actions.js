const mongoose      = require('mongoose');
const db            = mongoose.connection;
const jwt           = require('jsonwebtoken');
const key           = require('../../../config/keys.js');
const Watchlist        = require('../../../models/WatchList.js');
const User        = require('../../../models/User.js');
const Movie        = require('../../../models/MovieSchema.js');
const axios         = require('axios');

const addComment = (req, res) => {
    
    var currentTimestamp = Math.round((Date.now() / 1000))

    let imdbid = req.params.id;
    let userID = res.locals.id;
    let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`

    if (!userID) { return res.sendStatus(403) }

    let imdbcode = createInstance(urlID)
    if (!imdbcode) { return res.sendStatus(404) }

    var comment = req.body.comment
    if ( comment.length < 8  || isEmpty(comment) ) { return res.sendStatus(405) }

    Movie.findOne({ imdb_code: imdbcode }, (err, data) => {
        if (!data || err) { return res.sendStatus(404) }
        let newComment = {user: userID, comment: comment, date: currentTimestamp }
        data.comments.push(newComment)
        data.save( (err) => { if (err) { console.log(err) } })
    });
    return res.sendStatus(200)
}

const createInstance = async (baseUrl) => {
    try {
        let instance = axios.create({
            baseURL: baseUrl,
            headers: {  'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'X-Requested-With': 'XMLHttpRequest' }
        });
        return instance.get()
        .then((res => {
            if (res.status === 200 && res.data && res.data.imdb_id)
                return res.data.imdb_id

        }))
    } catch (err) { return null }
}

// Valeur à mettre: imdbid
const likeInteraction = async (req, res) => {
    try {
        let imdbid = req.params.id;
        let userID = res.locals.id;
        let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`
        let imdbcode = await createInstance(urlID)
        if (userID && imdbcode) {
            return  Movie.findOne({ imdb_code: imdbcode }, (err, data) => {
                if (!data || err)
                    return res.status(403).json({})
                if (!data.like.includes(userID))
                    data.like.push(userID);
                else
                    data.like = data.like.filter(like => like != userID)
                data.save((err) => { if(err) return res.status(403).json({})})
            });
            return res.status(200).json({})
        }
        return res.status(403).json({})
    } catch (err) { console.log(err) }
}


// Valeur à mettre = imdbid
const watchList = async(req, res) => {
    let imdbid = req.params.id;
    let userID = res.locals.id;
    let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`
    let imdbcode = await createInstance(urlID)
    if (userID && imdbcode) {
        return WatchList.findOne({user_id: userID}, (err, data) => {
            if (!data) {
                let addList = new WatchList({
                    user_id: userID,
                    movies: [imdbcode]
                });
                addList.save((err) => {
                    if(err) {
                        console.log(err);
                        return res.status(403).json({})
                    }
                })
            } else {
                if (!data.movies.includes(imdbcode))
                    data.movies.push(imdbcode)
                else
                    data.movies = data.movies.filter(movies => movies != imdbcode);
                data.save((err) => {
                    if (err){
                        console.log(err);
                        return res.status(403).json({})
                    }
                })
            }
            return res.status(200).json({})
        })
    }
    console.log(req.params)
    return res.status(403).json({})

};

// Valeur à mettre: id
const getWatchlist = (req, res) => {
    let userID = res.locals.id;
    if (userID) {
        return WatchList.findOne({user_id: userID}, (err, data) => {
            console.log(err);
            if (err)
                return res.status(400).json({})
            else
               return res.status(200).json({watchlist: data && data.movies ? data.movies : []});
        })
    }
    return res.status(400);
};

const getComments = async (req, res) => {
    try {
        let imdbid = req.params.id;
        let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`
        let imdbcode = await createInstance(urlID)
        if (imdbcode) {
            var comments = []
            Movie.findOne({ imdb_code: imdbcode }, (err, data) => {
                if (err) { return res.sendStatus(403) }
                if (!data) { return res.json({}) }
                return res.json(data.comments)
            });
        } else { return res.sendStatus(404) }
    } catch (err) { console.log(err) }
}

const getHistory = (req, res) => {
    let userID = res.locals.id;
    if (!userID)
        return res.sendStatus(404)
    User.findById(userID, (err, data) => {
        if (!data)
            return res.sendStatus(403)
        return res.json(data.history)
    })
}

const Actions = (req, res) => {
    if (req.params.action === 'like') {
        return likeInteraction(req, res)
    } else if (req.params.action === 'watchlist') {
        return watchList(req, res)
    }
    return res.status(400).json({})
};

module.exports = { Actions, getWatchlist, getHistory, addComment, getComments };