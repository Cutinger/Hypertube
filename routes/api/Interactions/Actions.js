const mongoose      = require('mongoose');
const db            = mongoose.connection;
const jwt           = require('jsonwebtoken');
const key           = require('../../../config/keys.js');
const Watchlist        = require('../../../models/WatchList.js');
const User        = require('../../../models/User.js');
const Movie        = require('../../../models/MovieSchema.js');
const axios         = require('axios');

///////////////////////////////////////////
// COMMENT GESTION
const addComment = async(req, res) => {
    
    let currentTimestamp = Math.round((Date.now() / 1000))

    let comment = req.body.comment;
    let username = '';
    let imdbid = req.params.id;
    let userID = res.locals.id;
    let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`

    if (!userID) { return res.status(403).json({}) }

    let imdbcode = await createInstance(urlID);
    if (!imdbcode) { return res.status(404).json({}) }

    try {
        let data = await User.findById(userID)
        if (!data) throw new Error ('error data');
        username = data.username;
    } catch(err) {
        return res.status(403).json({})
    }
    if ( !comment || comment && comment.length < 8 )
        return res.status(405).json({});

    try {
        let data = await Movie.findOne({imdb_code: imdbcode});
        if (!data)
            throw new Error('err findOne imdbcode');
        if (data) {
            let id;
            if (!data.comments.id) id = 1;
            else id = Math.max(...data.comments.map(o => o.id), 0) + 1;
            let newComment = {id: id, user: username, comment: comment, date: currentTimestamp};
            data.comments.push(newComment);
        }
    } catch(err) {
        return res.status(404).json({})
    }
    return res.status(200).json({})
};
const deleteComment = async (req, res) => {
    try {
        let imdbid = req.params.imdbid;
        var id = req.params.comment;
        let userID = res.locals.id;
        var deleted = false
        if (!userID) { return res.status(403).json({}) }

        let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`
        let imdbcode = await createInstance(urlID)

        User.findById(userID, (err, data) => {
            if (!data || err) { return res.status(403).json({}) }
            var username = data.username
        });

        Movie.findOne({imdb_code: imdbcode}, (err, data) => {
            if (!data || err) { return res.status(403).json({}) }
            for (let index = 0; index < data.comments.length; index++) {
                if (data.comments[index].user == username && data.comments[index].id == id) {
                    data.comments.splice(index, 1)
                    deleted = true
                    data.save( (err) => { if (err) { console.log(err) } })
                    break ;
                }
            }
        });

        if (deleted) { return res.status(200).json({})}
        else { return res.status(404).json({}) }

    } catch (err) {
        console.log(err)
    }
}

const getComments = async (req, res) => {
    try {
        let imdbid = req.params.id;
        let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`
        let imdbcode = await createInstance(urlID)
        if (imdbcode) {
            Movie.findOne({ imdb_code: imdbcode }, (err, data) => {
                if (err) { return res.status(403).json({}) }
                if (!data) { return res.status(200).json({}) }
                let commentsList = data.comments.sort( (a, b) => {
                    return b.date - a.date;
                });
                return res.status(200).json({commentsList})
            });
        } else { return res.status(404).json({})}
    } catch (err) {
       console.log(err, 'err getComments')
    }
}
///////////////////////////////////////////
///////////////////////////////////////////

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

const getHistory = (req, res) => {
    let userID = res.locals.id;
    if (!userID)
        return res.status(404).json({})
    User.findById(userID, (err, data) => {
        if (!data)
            return res.status(403).json({})
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

module.exports = { Actions, getWatchlist, getHistory, addComment, getComments, deleteComment };