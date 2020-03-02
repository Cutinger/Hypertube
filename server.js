const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require("passport");
const users = require("./routes/api/users");
const app = express();
const stream = require('./routes/api/Stream/DownloadTorrent.js');
const moviesData = require('./routes/api/MovieInfos/MoviesInfos.js');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const db = require("./config/keys").mongoURI;
require("./config/passport")(passport);

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

// Connect to mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => console.log('DB Connected!'))
.catch(err => { console.log(`DB Connection Error: ${err.message}`) });

// Passport middleware
app.use(passport.initialize());;

// UsersRoute
app.use ("/api/users", users);
// Stream routes
app.get('/api/movies/:stream/:quality/:imdbcode', (req, res) => { stream.getDataMovie(req, res) })
// Catch Movies route
app.get('/api/movies/:id', (req, res) => { moviesData.parseData(req.params.id, res) })

// Connect to server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server has started on port ${port}`))