const mongoose      = require('mongoose');
const db            = mongoose.connection;
const jwt           = require('jsonwebtoken');
const key           = require('../../../config/keys.js');
const Watchlist        = require('../../../models/WatchList.js');
const Movie        = require('../../../models/MovieSchema.js');

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
            if (!res.data.imdb_id)
                return null
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
                    return res.sendStatus(403)
                if (!data.like.includes(userID))
                    data.like.push(userID);
                else
                    data.like = data.like.filter(like => like != userID)
                data.save((err) => { if(err) return res.sendStatus(403)})
            });
            return res.sendStatus(200)
        }
        return res.sendStatus(403)
    } catch (err) { console.log(err) }
}


// Valeur à mettre = imdbid
const watchList = (req, res) => {
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
                    console.log(err + 'd');
                    if(err)
                        return res.status(403).json({})
                })
            } else {
                if (!data.movies.includes(imdbcode))
                    data.movies.push(imdbcode)
                else
                    data.movies = data.movies.filter(movies => movies != imdbcode);
                data.save((err) => {
                    console.log(err);
                    if (err) return res.status(403)
                })
            }
            return res.sendStatus(200)
        })
    }
    return res.sendStatus(403)

};

// Valeur à mettre: id
const getWatchlist = (req, res) => {
    let userID = res.locals.id;
    if (userID) {
        return WatchList.findOne({user_id: userID}, (err, data) => {
            console.log(err);
            if (err)
                return res.sendStatus(400)
            else
               return res.status(200).json({watchlist: data && data.movies ? data.movies : []});
        })
    }
    return res.sendStatus(400);
};

const Actions = (req, res) => {
    if (req.params.action === 'like') {
        likeInteraction(req, res)
    } else if (req.params.action === 'watchlist') {
        watchList(req, res)
    }
    return res.sendStatus(400)
};

module.exports = { Actions, getWatchlist };