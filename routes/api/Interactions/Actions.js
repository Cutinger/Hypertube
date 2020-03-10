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
    let comment = req.body.comment
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
    } catch (err) {
        return res.status(403).json({})
    }
    
    if ( !comment || comment && comment.length < 8 )
        return res.status(405).json({});
    try {
        var data = await Movie.findOne({imdb_code: imdbcode});
        if (!data) {
            let addMovie = new Movie({
                imdb_code:   imdbcode,
                userViews: [ userID ]
            })
            addMovie.save( (err) => { console.log(err) })
            data = await Movie.findOne({imdb_code: imdbcode});
        }
        let id;
        if (!data.comments.id) { id = 1; }
        else { id = Math.max(...data.comments.map(o => o.id), 0) + 1; }
        var newComment = {id: id, user: username, comment: comment, date: currentTimestamp};
        data.comments.push(newComment);
        data.save((err) => { if (err) return res.status(403).json({})})
    } catch(err) {
        return res.status(404).json({})
    }
    return res.status(200).json({newComment})
}

const deleteComment = async (req, res) => {

    let imdbid = req.params.imdbid;
    var id = req.params.comment;
    let userID = res.locals.id;
    var deleted = false
    if (!userID) { return res.status(403).json({}) }

    let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`
    let imdbcode = await createInstance(urlID)
    if (!imdbcode) { return res.status(404).json({}) }

    try {
        let dataUsers = await User.findById(userID)
        if (!dataUsers) { throw new Error ('No users found with this ID: ', userID); }
        var username = dataUsers.username
    } catch (err) { res.status(403).json({}) }

    try {
        let dataMovies = await Movie.findOne({imdb_code: imdbcode})
        if (!dataMovies) { throw new Error ('No movie found with this imdbcode: ', imdbcode); }
        for (let index = 0; index < dataMovies.comments.length; index++) {
            if (dataMovies.comments[index].user == username && dataMovies.comments[index].id == id) {
                dataMovies.comments.splice(index, 1)
                deleted = true
                dataMovies.save( (err) => { if (err) { console.log(err) } })
                break ;
            }
        }
    } catch (err) { res.status(403).json({}) } 

    if (deleted) { return res.status(200).json({})}
    else { return res.status(404).json({}) }

}

const getComments = async (req, res) => {
    let imdbid = req.params.id;
    let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`
    let imdbcode = await createInstance(urlID)
    if (!imdbcode) { return res.status(404).json({}) }
    try {
        let dataMovies = await Movie.findOne({ imdb_code: imdbcode })
        if (!dataMovies) { throw new Error ('No movie found with this imdbcode: ', imdbcode); }
        let commentsList = dataMovies.comments.sort( (a, b) => {
            return b.date - a.date;
        });
        return res.status(200).json({commentsList})
    } catch (err) { res.status(403).json({}) }
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
    let imdbid = req.params.id;
    let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`

    let userID = res.locals.id;
    if (!userID) { return res.status(403).json({}) }

    let imdbcode = await createInstance(urlID)
    if (!imdbcode) { return res.status(404).json({}) }

    try {
        let dataMovies = await Movie.findOne({ imdb_code: imdbcode })
        if (!dataMovies) { throw new Error ('No movie found with this imdbcode: ', imdbcode); }
        if (!dataMovies.like.includes(userID))
            dataMovies.like.push(userID);
        else
            dataMovies.like = dataMovies.like.filter(like => like != userID)
        dataMovies.save((err) => { if (err) return res.status(403).json({})})
        return res.status(200).json({})
    } catch (err) { res.status(403).json({}) }
}


// Valeur à mettre = imdbid
const watchList = async(req, res) => {
    let imdbid = req.params.id;
    let urlID = `https://api.themoviedb.org/3/movie/${imdbid}?api_key=${key.apiIMDB}`

    let userID = res.locals.id;
    if (!userID) { return res.status(403).json({}) }

    let imdbcode = await createInstance(urlID)
    if (!imdbcode) { return res.status(404).json({}) }

    try {
        let watchDatas = await WatchList.findOne({user_id: userID})
        if (!watchDatas) {
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
            if (!watchDatas.movies.includes(imdbcode))
            watchDatas.movies.push(imdbcode)
            else
            watchDatas.movies = watchDatas.movies.filter(movies => movies != imdbcode);
            watchDatas.save((err) => {
                if (err){
                    console.log(err);
                    return res.status(403).json({})
                }
            })
        }
        return res.status(200).json({})
    } catch (err) { res.status(403).json({}) }
}

// Valeur à mettre: id
const getWatchlist = async (req, res) => {
    let userID = res.locals.id;
    if (!userID) { return res.status(403).json({}) }
    
    try {
        let watchDatas = await WatchList.findOne({user_id: userID})
        return res.status(200).json({watchlist: watchDatas && watchDatas.movies ? watchDatas.movies : []});
    } catch (err) { res.status(403).json({}) }
}

const getHistory = async (req, res) => {
    let userID = res.locals.id;
    if (!userID) { return res.status(404).json({}) }

    try {
        let userDatas = await User.findById(userID)
        if (!userDatas) { throw new Error ('No user found with this id: ', userID); }
        return res.json(userDatas.history)
    } catch (err) { res.status(403).json({}) }
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