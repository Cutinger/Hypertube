const torrent       = require('torrent-stream');
const pump          = require('pump');
const ffmpegPath    = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg        = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

const path = `./files/test`

const options = {
    connections: 100,
    uploads: 10,
    tmp: './files/cache',
    path: path
}

var getExtensions = (ext, filename) => {
    for (let index = 0; index < ext.length; index++) {
        if (ext[index] == filename.substr(filename.length - 3, filename.length)) {
            return true
        }
    }
    return false
}

const streamConvert = (res, file, range) => {

    const stream = file.createReadStream()
    console.log('Starting conversion')

    if (range) {
        var bytes = range.replace(/bytes=/, '').split('-')
    } else {
        var bytes = null
    }

    if (bytes) {
        var start = parseInt(bytes[0], 10)
    } else {
        var start = 0
    }

    if (bytes && bytes[1]) {
        var end = parseInt(bytes[1], 10)
    } else {
        var end = file.length - 1
    }

    var lengthFile = parseInt(end - start) + 1

    res.on('close', () => {
        console.log('Stream closed')
    })

    const conversionStream = ffmpeg(stream)
        .on('error', function(err) {
            console.log('error: ', err)
        })
        .format('webm')
        .videoCodec('libvpx')

    res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache, no-store',
        'Content-Range': `bytes ${start}-${end}/${file.length}`,
        'Content-Length': lengthFile,
        'Content-Type': 'video/webm'
    })

    pump(conversionStream, res)

}

const streamMP4 = (res, engine, file, range) => {

    console.log('Start streaming in MP4')

    // On récupére la range (Content-Range) dans le header s'il existe, sinon on en crée un
    if (range) {
        var parts = range.replace(/bytes=/, '').split('-')
    } else {
        var parts
    }

    if (parts) {
        var start = parseInt(parts[0], 10)
    } else {
        var start = 0
    }

    if (parts && parts[1]) {
        var end = parseInt(parts[1], 10)
    } else {
        var end = file.length - 1
    }

    const stream = file.createReadStream({ start, end })
    const length = parseInt(end - start) + 1

    res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache, no-store',
        'Content-Range': `bytes ${start}-${end}/${file.length}`,
        'Content-Length': length,
        'Content-Type': 'video/mp4'
    })

    res.on('close', () => {
        engine.remove(true, () => { console.log('Engine removed') } )
        engine.destroy()
    })

    pump(stream, res)
}

const initStreaming = (req, res, magnet) => {

    const engine = torrent(magnet, options)
    const { range } = req.headers

    engine.on('ready', function () {

        let isStreaming = false

        console.log('Engine is ready')
        engine.files.forEach((file) => {
            if (!isStreaming && getExtensions(['mp4', 'avi', 'mkv', 'webm'], file.name)) {
                isStreaming = true
                if (getExtensions(['avi', 'mkv'], file.name))
                    streamConvert(res, file, range)
                else
                    streamMP4(res, engine, file, range)
            }
        })
    })
}

module.exports = { initStreaming }