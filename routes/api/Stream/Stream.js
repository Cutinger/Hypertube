const torrent       = require('torrent-stream');
const mongoose      = require('mongoose');
const fs            = require('fs');
const ffmpeg        = require('fluent-ffmpeg');
const db            = mongoose.connection;
const schema        = require('../../../models/MovieSchema.js')
const user          = require('../../../models/User.js')
const jwt           = require('jsonwebtoken')
const key           = require('../../../config/keys.js')

const ffmpegPath    = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

const path = './files/test'

const options = {
    connections: 100,
    uploads: 10,
    tmp: './files/cache',
    path: path
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

var getExtensions = (ext, filename) => {
    for (let index = 0; index < ext.length; index++) {
        if (ext[index] == filename.substr(filename.length - 3, filename.length)) {
            return true
        }
    }
    return false
}


const getPathByMagnet = (magnet, movieDB) => {
    for (let index = 0; index < movieDB.path.length; index++) {
        if (movieDB.path[index].magnet == magnet)
            return movieDB.path[index].path
    }
}

const setDownloadedMovie = (magnet, moviePath, movieInfos, req) => {
    var imdb_code = movieInfos.imdb_code
    Movie.findOne({ imdb_code: imdb_code }, (err, data) => {
        var notDownloaded = { type: req.params.stream, magnet: magnet, quality: req.params.quality, state: false }
        for (let index = 0; index < data.downloaded.length; index++) {
            if (JSON.stringify(notDownloaded) === JSON.stringify(data.downloaded[index])) {
                data.downloaded.splice(index, 1, { type: req.params.stream, magnet: magnet, quality: req.params.quality, state: true })
                data.path.push({ magnet: magnet, path: moviePath })
                data.save( (err) => {
                    if (err) { console.log('cannot update the movie statut, error: ' + err) }
                    else { console.log('the movie is now set as downloaded!') }
                })
            }
        }
        if (err) { console.log(err) }
    })
}

const addMovietoDB = async (req, movieInfos, magnet, userID) => {
    var imdb_code = movieInfos.imdb_code
    try {

        var notDownloaded = { type: req.params.stream,
                              magnet: magnet,
                              quality: req.params.quality,
                              state: false }

        var addMovie = new Movie({
            imdb_code:   imdb_code,
            downloaded: notDownloaded,
            userViews: [ userID ]
        })

        addMovie.save( (err) => { console.log(err) })

    } catch (err) { console.log(err) }
}

function checkTorrentStatus(engine, magnet, moviePath, movieInfos, req) {
    var total = 0
    engine.files.forEach((file) => {
        if (getExtensions(['mp4', 'avi', 'mkv', 'webm'], file.name)) {
            total += file.length
            console.log('Total : ' + formatBytes(parseInt(total)))
            console.log('Downloaded : ' + formatBytes(parseInt(engine.swarm.downloaded)))
            console.log('-------------------------------------------')
            if (engine.swarm.downloaded >= total) {
                console.log('===========================')
                console.log('Download is complete!')
                console.log('===========================')
                setDownloadedMovie(magnet, moviePath, movieInfos, req)
                engine.remove(true, () => { console.log('Engine removed') } )
                engine.destroy()
            }
        }
    })
}

const streamVIDEO = (res, file, range, filexists = false, contentType) => {

    if (filexists) {
        var length = fs.statSync(file).size;
        var fileSize = length
        var fileLength = fileSize - 1
    } else {
        var fileLength = file.length - 1
    }

    // On récupére la range (Content-Range) dans le header s'il existe, sinon on en crée un
    var parts = range ? range.replace(/bytes=/, '').split('-') : null
    var start = parts ? parseInt(parts[0], 10) : 0
    var end = parts && parts[1] ? parseInt(parts[1], 10) : fileLength

    const stream = filexists ? fs.createReadStream(file, {start, end}) : file.createReadStream({ start, end })
    
    if (!filexists) {
        var length = parseInt(end - start) + 1
        var fileSize = file.length
    }

    if (contentType == 'video/webm') {
        console.log('Start conversion into WEBM')
        var videoStream = ffmpeg(stream)
        .on('error', function(err) {
            console.log('error: ', err)
        })
        .format('webm')
        .videoCodec('libvpx')
    } else {
        console.log('Start streaming in MP4')
        var videoStream = stream
    }

    res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache, no-store',
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': length,
        'Content-Type': contentType
    })

    videoStream.pipe(res)
}

const downloadTorrent = (req, res, magnet, movieInfos, movieDB, inDB, userID) => {
    var moviePath
    var filexists = false
    const engine = torrent(magnet, options)
    const { range } = req.headers

    engine.on('ready', function () {
        let isStreaming = false
        console.log('Engine is ready')

        engine.files.forEach((file) => {
            if (!isStreaming && getExtensions(['mp4', 'avi', 'mkv', 'webm'], file.name)) {
                file.select()
                isStreaming = true
                moviePath = path + '/' + file.path
                if (movieDB) {
                    for (let index = 0; index < movieDB.path.length; index++) {
                        if (movieDB.path[index].path == moviePath) {
                            console.log('WAIT!... I think this have been already downloaded, the engine path is the same!')
                            console.log('Let\'s stream the file inside the registered path')
                            if (getExtensions(['avi', 'mkv'], file.name))
                                streamVIDEO(res, moviePath, range, false, 'video/webm')
                            else
                                streamVIDEO(res, moviePath, range, true, 'video/mp4')
                            engine.remove(true, () => { console.log('Engine removed') } )
                            engine.destroy()
                            filexists = true
                        }
                    }
                }
                if (!inDB && !filexists) { addMovietoDB(req, movieInfos, magnet, userID) }
                if (getExtensions(['avi', 'mkv'], file.name) && !filexists)
                    streamVIDEO(res, file, range, false, 'video/webm')
                else if (!filexists)
                    streamVIDEO(res, file, range, false, 'video/mp4')
            }
        })
    })
    
    engine.on('download', () => {
        if (moviePath)
            checkTorrentStatus(engine, magnet, moviePath, movieInfos, req)
    })
}

const addViews = (imdbcode, userID) => {
    Movie.findOne({ imdb_code: imdbcode }, (err, data) => {
        if (!data)
            return ;
        if (err) {
            console.log(err)
        } else if (userID && !data.userViews.includes(userID)) {
            data.userViews.push(userID)
            data.save( (err) => { console.log(err) })
        }
    })
    User.findById(userID, (err, data) => {
        let exists = false
        let currentDate = new Date();
        if (!data)
            return ;
        for (let index = 0; index < data.history.length; index++) {
            if (data.history[index].imdbcode == imdbcode) {
                data.history[index].date = currentDate.getFullYear() + '-' + ( currentDate.getMonth() +1 ) + '-' + currentDate.getDate();
                exists = true
                break ;
            }
        }
        if (!exists) {
            let newElem = { imdbcode: imdbcode, date: currentDate }
            data.history.push(newElem)
        }
        data.save( (err) => { console.log(err) })
    })
}

const initStreaming = async (req, res, magnet, movieInfos, userID) => {
    var imdb = req.params.imdbcode
    var streaming = false

    console.log('== init streaming ==')
    console.log('== ========================  ==')

    addViews(imdb, userID)

    var actualRequest = JSON.stringify({ type: req.params.stream,
                          magnet: magnet,
                          quality: req.params.quality,
                          state: true })

    var notDownloaded = JSON.stringify({ type: req.params.stream,
                          magnet: magnet,
                          quality: req.params.quality,
                          state: false })

    Movie.findOne({ imdb_code: imdb }, (err, data) => {
        if (data) {
            for (let index = 0; index < data.downloaded.length; index++) {
                var dbIndex = JSON.stringify(data.downloaded[index])
                if (dbIndex === actualRequest) {
                    console.log('- MOVIE IN DB AND DOWNLOADED! Streaming can start :) -')
                    const { range } = req.headers
                    if (getExtensions(['avi', 'mkv'], getPathByMagnet(data.downloaded[index].magnet, data)))
                        streamVIDEO(res, getPathByMagnet(data.downloaded[index].magnet, data), range, true, 'video/webm')
                    else
                        streamVIDEO(res, getPathByMagnet(data.downloaded[index].magnet, data), range, true, 'video/mp4')
                    streaming = true
                    break ;
                } else if (dbIndex === notDownloaded && !streaming) {
                    console.log('- Movie is in DB, but download is not over yet. Download is starting -')
                    downloadTorrent(req, res, magnet, movieInfos, data, true, userID)
                    streaming = true
                    break ;
                }
            }
            if (data.downloaded.length > 0 && !streaming) {
                console.log('- Movie is in the DB, but have no entries for this quality / stream provenance -')
                data.downloaded.push(JSON.parse(notDownloaded))
                data.save( (err) => { console.log(err) })
                downloadTorrent(req, res, magnet, movieInfos, data, true, userID)
                return ;
            }
        } else {
            console.log('Movie not found in the DB. Download is starting')
            downloadTorrent(req, res, magnet, movieInfos, data, false, userID)
        }
        if (err) { console.log(err) }
    })
}

module.exports = { initStreaming }