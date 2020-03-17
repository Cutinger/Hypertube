const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require("passport");
const users = require("./routes/api/users");
const express = require('express')
const app = express();
const server = require('http').createServer();
const stream = require('./routes/api/Stream/DownloadTorrent.js');
const moviesData = require('./routes/api/MovieInfos/MoviesInfos.js');
const interact = require('./routes/api/Interactions/Actions.js');
const picture = require('./routes/api/Interactions/Pictures.js');
const socketFunctions = require('./utils/socketFunctions');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const db = require("./config/keys").mongoURI;
const auth = require("./routes/api/auth");
const withAuth = require('./utils/middleware');
const port = 5000;
const io = require('socket.io')(server, {
    path: '/',
    serveClient: false,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: true
});
require("./config/passport")(passport);

// Connect to mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => console.log('DB Connected!'))
    .catch(err => { console.log(`DB Connection Error: ${err.message}`) });

// Config
app.use(helmet());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
app.use(cookieParser());
app.use(bodyParser.urlencoded( { extended: false }) );
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
// Use static files for subtitles
app.use('/api/subtitles', express.static('files/subtitles'));
app.use('/public', express.static('public'));

// Sockets (construct userslist tab)
    let userslist = [];
/*     // For debug, console.log every seconds
        let CronJob = require('cron').CronJob;
        let job = new CronJob('* * * * * *', function() {
            console.log(userslist);
        });
        job.start(); */
    io.sockets.on('connection', async(socket) => {
        if (userslist){
            if (socket.handshake.headers.cookie) {
                userslist = await socketFunctions.pushUserSocket(socket, userslist, '');
                socket.on('stream:play', async (movieID) => {
                    userslist = await socketFunctions.pushUserSocket(socket, userslist, movieID);
                });
                socket.on('stream:unmount', async () => {
                    userslist = await socketFunctions.deleteUserSocket(socket, userslist);
                });
                socket.on('disconnect', async () => {
                    userslist = await socketFunctions.deleteUserSocket(socket, userslist);
                });
            }
        }
    });

// Define routes
app.use ("/api/users", users);
app.use ("/api/auth", auth);
// Pictures
app.post('/api/picture/add/:token',  withAuth, picture.upload.single('file'), picture.uploadPhoto);
// Stream routes
app.get('/api/movies/:stream/:quality/:imdbcode', (req, res) => {
    withAuth(req, res, stream.getDataMovie(req, res, userslist))
})
// Catch Movies route
app.get('/api/movies/:id', moviesData.parseData);
// Actions to a video
app.get('/api/movies/:id/:action', withAuth, interact.Actions);
// Get watchlist
app.get('/api/watchlist', withAuth, interact.getWatchlist);
// Get history
app.get('/api/history', withAuth, interact.getHistory);
// Get comment
app.get('/api/infos/:id', withAuth, interact.getInfos);
// Get user infos
app.get('/api/users', withAuth, interact.getUserProfile);
// Get user public infos
app.get('/api/users/:username', withAuth, interact.getUserProfilePublic);
// Delete comment
app.get('/api/delete/comment/:imdbid/:id', withAuth, interact.deleteComment);
app.post('/api/comment/:id', withAuth, interact.addComment)
app.post('/api/user/update', withAuth, interact.updateInfos);


app.listen(port, () => console.log(`Server has started on port ${port}`));
server.listen(8000, () => console.log(`Server has started on port 8000`));