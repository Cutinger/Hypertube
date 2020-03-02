const axios         = require('axios');
const stream        = require('./Stream.js')
const scrapTorrent  = require('../MovieInfos/MoviesInfos.js')

const apiKey    = 'f29f2233f1aa782b0f0dc8d6d9493c64'

/* const db            = require('../schemas/db.js')  /* A exporter dans la page du film */
/* const schema        = require('../schemas/MovieSchema.js') /* A exporter dans la page du film */

const udpYTS = [
    'udp://open.demonii.com:1337/announce',
    'udp://tracker.openbittorrent.com:80',
    'udp://tracker.coppersurfer.tk:6969',
    'udp://glotorrents.pw:6969/announce',
    'udp://tracker.opentrackr.org:1337/announce',
    'udp://torrent.gresille.org:80/announce',
    'udp://p4p.arenabg.com:1337',
    'udp://tracker.leechers-paradise.org:6969'
]

const axiosQuery = async (baseURL, type) => {
    try {
        const instance = axios.create({
            baseURL: baseURL,
            headers: {  'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'X-Requested-With': 'XMLHttpRequest' }
            });
        return instance.get()
        .then((res => {
            switch (type) {
                case 'imdb_id':
                    if (res.data.movie_results[0].id == undefined)
                        return null
                    return res.data.movie_results[0].id
                case 'leet':     
                    if (res.data.inLeet == 'yes')
                        return res.data.leetInfo
                    return null
                case 'yts':
                    if (res.data.data.movies == undefined)
                        return null
                    return res.data.data.movies[0]
                default:
                    console.log('wrong parameter (' + type + ') for axiosQuery')
            }
        }))
    } catch (error) { console.error(error) }     
}

const URLmagnetYTS = (hash, title) => {
    console.log(udpYTS.join('&tr='));
    return `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}&tr=${udpYTS.join('&tr=')}`
}


/////////////////////////////////////////
/////////////////////////////////////////
/*                                     */
/* /!\ A mettre dans la page du film,  */
/*  si je les laisse ici, tu auras     */
/*  une vue à chaque fois que le       */
/*  header de la page se rafraichit /!\*/
/*                                     */
/////////////////////////////////////////
/////////////////////////////////////////

/* const getFrenchInfos = async (baseURL) => {
    try {
        const instance = axios.create({
            baseURL: baseURL,
            headers: {  'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'X-Requested-With': 'XMLHttpRequest' }
            });
        return instance.get()
        .then((res => {
            if (res.data == undefined)
                return null
            return res.data
        }))
    } catch (error) { console.error(error) }
}

const addMovietoDatabase = async (movie) => {
    try {
        var apikey = 'f29f2233f1aa782b0f0dc8d6d9493c64'
        var frenchMovie = await getFrenchInfos('https://api.themoviedb.org/3/movie/' + movie.imdb_code + '?api_key=' + apikey + '&language=fr')

        var addMovie = new Movie({
            imdbid:   movie.imdb_code,
            title:    [ movie.title_long, frenchMovie.title ],
            overview: [ movie.summary, frenchMovie.overview ],
            rating:   frenchMovie.vote_average,
            poster:   [ movie.large_cover_image, frenchMovie.poster_path ],
            productionYear: movie.year,
            genres: movie.genres
        })
        Movie.findOne({ imdbid: movie.imdb_code }, (err, data) => {
            if (data) {
                data.views += 1
                data.save( (err) => {
                    if (err)
                        console.log('cannot update the view, error: ' + err)
                    else
                        console.log('views updated: ' + parseInt(data.views + 1) + ' total views for ' + movie.imdb_code)
                })
            } else {
                addMovie.save( (err) => {
                    console.log(err)
                })
            }
        })
    } catch (err) { console.log(err) }
} */

const checkQuality1377 = (leetinfos, quality) => {
    for (let index = 0; index < leetinfos.length; index++) {
        if (quality == leetinfos[index].quality)
            return index
    }
    return false
}

const printLeet = async (req, res, quality, imdbcode) => {
    try {
        var urlID = `https://api.themoviedb.org/3/find/${imdbcode}?api_key=${apiKey}&external_source=imdb_id`
        var imdbID = await axiosQuery(urlID, 'imdb_id')
        if ( !imdbID )
            return res.sendStatus(404)
        var leetInfos = await axiosQuery('http://localhost:5000/api/movies/' + imdbID, 'leet');
        var quality = checkQuality1377(leetInfos, quality)
        if ( !leetInfos || quality === false)
            return res.sendStatus(404)
        var magnetLink = leetInfos[quality].magnet
        stream.initStreaming(req, res, magnetLink)
    } catch (err) { return res.sendStatus(203) }
}

const printYTS = async (baseURL, req, res, quality) => {
    try {
        var movie = await axiosQuery(baseURL, 'yts');
        console.log(movie);
        if (movie != null) {
            var correctQuality = false
            for (var index = 0; index < movie.torrents.length; index++) {
                if (movie.torrents[index].quality == quality) {
                    correctQuality = true
                    break;
                }
            }
            if (correctQuality == false)
               res.sendStatus(404);
            /* await addMovietoDatabase(movie) <----- Voir le commentaire plus haut */
            var magnet = URLmagnetYTS(movie.torrents[index].hash, movie.title_long)
            stream.initStreaming(req, res, magnet)
        }
        else
            return res.sendStatus(404)
    } catch (error) { return res.sendStatus(203) }
}

const getDataMovie = (req, res) => {
    const paramStream = req.params.stream
    const quality     = req.params.quality + 'p'
    var imdbcode      = req.params.imdbcode
    if (paramStream == 'yts') {
        printYTS(`https://cors-anywhere.herokuapp.com/yts.mx/api/v2/list_movies.json?query_term=${req.params.imdbcode}`, req, res, quality)
    } else if (paramStream == '1377') {
        printLeet(req, res, quality, imdbcode)
    } else {
        return res.sendStatus(404)
    }
}

module.exports = { getDataMovie }