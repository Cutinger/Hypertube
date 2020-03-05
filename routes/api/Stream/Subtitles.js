const OS        = require('opensubtitles-api');
const fs        = require('fs');
const strvtt    = require('srt-to-vtt');
const download  = require('download')

const OpenSubtitles = new OS({
    useragent:'TemporaryUserAgent',
    username: 'dilaouid',
    password: 'RHPXwqWzYwrEQ2eV'
});

const dir = 'client/src/assets/subtitles'

const convertVTT = (url, dirName, filename, lang) => {
    return new Promise( async (res) => {
        try {
            const data = await download(url, dir)

            if (!fs.existsSync(`${dir}/${dirName}`)) {
                fs.mkdirSync(`${dir}/${dirName}`)
            }

            fs.writeFileSync(`${dir}/${dirName}/${filename}`, data)
            fs.createReadStream(`${dir}/${dirName}/${filename}`)
                .pipe(strvtt())
                .pipe(fs.createWriteStream(`${dir}/${dirName}/${filename}_${lang}.vtt`))

            fs.unlink(`${dir}/${dirName}/${filename}`, () => {
                const path = `${dir}/${dirName}/${filename}_${lang}.vtt`
                return res(path)
            })
        }
        catch(err) { console.log('An error occured during when converting the subtitles to a VTT format: ' + err) }
    })
}

const getSubtitles = (imdb_code) => {

    var frenchSub = false
    var engSub = false

    if (fs.existsSync(`${dir}/${imdb_code}/movie_fr.vtt`)) {
        frenchSub = true
    } if (fs.existsSync(`${dir}/${imdb_code}/movie_en.vtt`)) {
        engSub = true
    }

    if (!engSub || !frenchSub) {
        return new Promise( async (res) => {
            try {
                console.log('Looking for subtitles for ' + ' (' + imdb_code + ')')
                const datasub = await OpenSubtitles.search({ imdbid: imdb_code })
                const subtitles = { en: null, fr: null }
                if (datasub.fr && !frenchSub) {
                    try {
                        console.log('found in french: ' + datasub.en.url)
                        const path = await convertVTT(datasub.fr.url, imdb_code, 'movie', 'fr')
                        subtitles.fr = path
                    }
                    catch(err) { console.log('An error occured during when providing the subtitles: ' + err) }
                }
                if (datasub.en && !engSub) {
                    try {
                        console.log('found in english: ' + datasub.en.url)
                        const path = await convertVTT(datasub.en.url, imdb_code, 'movie', 'en')
                        subtitles.en = path
                    }
                    catch(err) { console.log('An error occured during when providing the subtitles: ' + err) }
                }
                if (!datasub.fr && !datasub.en) { console.log('No subtitles available for this movie... Or it has already been downloaded') }

                return res(subtitles)
            }
            catch(err) { console.log('An error occured during when providing the subtitles: ' + err) }
        })
    }
}

module.exports = { getSubtitles }