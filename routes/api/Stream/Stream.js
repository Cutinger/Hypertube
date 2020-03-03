const torrent       = require('torrent-stream');
const mongoose      = require('mongoose');
const fs            = require('fs');
const ffmpeg        = require('fluent-ffmpeg');
const db            = mongoose.connection;
const schema        = require('../../../models/MovieSchema.js')

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
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

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

const addMovietoDB = async (req, movieInfos, magnet) => {
    var imdb_code = movieInfos.imdb_code
    try {

        var notDownloaded = { type: req.params.stream,
                              magnet: magnet,
                              quality: req.params.quality,
                              state: false }

        var addMovie = new Movie({
            imdb_code:   imdb_code,
            downloaded: notDownloaded
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

const streamConvert = (res, file, range, filexists = false) => {

    if (filexists) {
        var length = fs.statSync(file).size;
        var fileSize = length
        var fileLength = fileSize - 1
    } else {
        var fileLength = file.length - 1
    }

    var parts = range ? range.replace(/bytes=/, '').split('-') : null
    var start = parts ? parseInt(parts[0], 10) : 0
    var end = parts && parts[1] ? parseInt(parts[1], 10) : fileLength

    const stream = filexists ? fs.createReadStream(file, {start, end}) : file.createReadStream({ start, end })

    if (!filexists) {
        var length = parseInt(end - start) + 1
        var fileSize = file.length
    }

    const conversionStream = ffmpeg(stream)
        .on('error', function(err) {
            console.log('error: ', err)
        })
        .format('webm')
        .videoCodec('libvpx')

    res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache, no-store',
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': length,
        'Content-Type': 'video/webm'
    })

    conversionStream.pipe(res)

}

const streamMP4 = (res, file, range, filexists = false) => {

    console.log('Start streaming in MP4')

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

    res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache, no-store',
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': length,
        'Content-Type': 'video/mp4'
    })

    stream.pipe(res)
}

const downloadTorrent = (req, res, magnet, movieInfos, movieDB, inDB) => {
    var moviePath
    var filexists = false
    const engine = torrent(magnet, options)
    const { range } = req.headers

    engine.on('ready', function () {
        let isStreaming = false
        console.log('Engine is ready')

        engine.files.forEach((file) => {
            if (!isStreaming && getExtensions(['mp4', 'avi', 'mkv', 'webm'], file.name)) {
                isStreaming = true
                moviePath = path + '/' + file.path
                if (movieDB) {
                    for (let index = 0; index < movieDB.path.length; index++) {
                        if (movieDB.path[index].path == moviePath) {
                            console.log('WAIT!... I think this have been already downloaded, the engine path is the same!')
                            console.log('Let\'s stream the file inside the registered path')
                            if (getExtensions(['avi', 'mkv'], file.name))
                                streamConvert(res, moviePath, range)
                            else
                                streamMP4(res, moviePath, range, true)
                            engine.remove(true, () => { console.log('Engine removed') } )
                            engine.destroy()
                            filexists = true
                        }
                    }
                }
                if (!inDB && !filexists) { addMovietoDB(req, movieInfos, magnet) }
                if (getExtensions(['avi', 'mkv'], file.name) && !filexists)
                    streamConvert(res, file, range)
                else if (!filexists)
                    streamMP4(res, file, range)
            }
        })
    })
    
    engine.on('download', () => {
        if (moviePath)
            checkTorrentStatus(engine, magnet, moviePath, movieInfos, req)
    })
}

const initStreaming = async (req, res, magnet, movieInfos) => {
    var imdb = req.params.imdbcode
    var streaming = false
    console.log('== init streaming ==')

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
            data.views += 1
            for (let index = 0; index < data.downloaded.length; index++) {
                var dbIndex = JSON.stringify(data.downloaded[index])
                if (dbIndex === actualRequest) {
                    console.log('- MOVIE IN DB AND DOWNLOADED! Streaming can start :) -')
                    const { range } = req.headers
                    if (getExtensions(['avi', 'mkv'], getPathByMagnet(data.downloaded[index].magnet, data)))
                        streamConvert(res, getPathByMagnet(data.downloaded[index].magnet, data), range, true)
                    else
                        streamMP4(res, getPathByMagnet(data.downloaded[index].magnet, data), range, true)
                    streaming = true
                    break ;
                } else if (dbIndex === notDownloaded && !streaming) {
                    console.log('- Movie is in DB, but download is not over yet. Download is starting -')
                    downloadTorrent(req, res, magnet, movieInfos, data, true)
                    streaming = true
                    break ;
                }
            }
            if (data.downloaded.length > 0 && !streaming) {
                console.log('- Movie is in the DB, but have no entries for this quality / stream provenance -')
                data.downloaded.push(JSON.parse(notDownloaded))
                data.save( (err) => { console.log(err) })
                downloadTorrent(req, res, magnet, movieInfos, data, true, true)
                return ;
            }
        } else {
            console.log('Movie not found in the DB. Download is starting')
            downloadTorrent(req, res, magnet, movieInfos, data, false)
        } if (err) { console.log(err) }
    })
}

module.exports = { initStreaming }