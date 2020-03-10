import React, { useState, useEffect } from 'react';
import {fade, makeStyles} from '@material-ui/core/styles';
import {Container, Popover, Divider, Typography, Grid, Grow, Button, Dialog, DialogTitle, List, ListItem, Fade, ListItemAvatar, Avatar, ListItemText} from '@material-ui/core';
import StarRatings from 'react-star-ratings';
import InputBase from '@material-ui/core/InputBase';
import axios from 'axios';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddCircle from '@material-ui/icons/AddCircle';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ReactPlayer from "react-player";
import API from './../../utils/API';
import CommentIcon from '@material-ui/icons/Sms';
import SendIcon from '@material-ui/icons/Send';
const burl = 'http://localhost:5000/api'

const Aux = (props) => props.children;

const useStyles = makeStyles(theme => ({
    containerMovieDetails: {
        marginTop: '7em',
        position: 'relative'
    },
    movieTitle: {
        color: 'white',
        textAlign: 'left !important',
        marginBottom: '0',
        marginTop: '0',
        fontSize: '1.5em',
        verticalAlign: 'middle',
        textShadow: '1px 1px 5px rgba(0,0,0,0.7)'
    },
    movieRating: {
        textAlign: 'center !important',
        marginTop: '0em',
        '& svg':{
            'filter': 'drop-shadow(2px 2px 1px rgba(50, 50, 0, 0.12))'
        }
    },
    movieCoverContainer: {
        width: '190px',
        height: '280px',
        overflow: 'hidden',
        borderRadius: '10px'

    },
    containerImg: {
        textAlign: 'center',
        '& img': {
            boxShadow: '10px 10px 2px rgba(0,0,0,0.05)'
        },
    },
    moviesGenres: {
        background: 'linear-gradient(-317deg, rgba(32, 122, 244, 0.5) -25%, #0b1123, #0b1123 70%, rgba(240, 38, 120, 1) 160% ) !important',
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.3)',
        padding: '3px',
        paddingRight: '7px',
        paddingLeft: '9px',
        marginRight: '0.5em',
        marginBottom: '0.5em',
        borderRadius: '10px',
        fontSize: '0.8em',
        textShadow: '0px 1px 1px rgba(50, 50, 0, 0.2)',
        boxShadow: '2px 2px 2px rgba(50, 50, 0, 0.05)',
        minWidth: '0.8em',
    },
    movieOverview: {
        color: 'white',
        fontSize: '0.8em',
        textAlign: 'left',
        paddingRight: '1.5em',
        lineHeight: '1.2em',
        marginTop: '1.2em',
        marginBottom: '1.2em',
        letterSpacing: '0px',
        // fontFamily: 'Open-Sans, sans-serif',
    },
    releaseDate: {
        marginRight: '1em',
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.3)',
        padding: '3px',
        paddingRight: '7px',
        paddingLeft: '7px',
        borderRadius: '10px',
        fontSize: '0.8em',
        textShadow: '0px 1px 1px rgba(50, 50, 0, 0.2)',
        boxShadow: '2px 2px 2px rgba(50, 50, 0, 0.05)'
    },
    containerDate_Vote: {
        textAlign: 'left',
        marginTop: '1em'
    },
    commentIcon: {
        color: '#ffffff',
        fontSize: '2em',
        verticalAlign: 'middle' ,
        '&:hover': {
            opacity: '1',
            transform: 'scale(1.2)'
        }
    },
    movieAddList: {
        color: '#f7c12d',
        fontSize: '2em',
        verticalAlign: 'middle' ,
        '&:hover': {
            opacity: '1',
            transform: 'scale(1.2)'
        }
    },
    movieReturnBack: {
        fontSize: '2em',
        paddingTop: '5px',
        verticalAlign: 'middle' ,
        '&:hover': {
            opacity: '1',
            transform: 'scale(1.2)'
        }
    },
    player: {
        width: '100% !important',
        height: '360px !important'
    },
    buttonChooseSource: {
        color: 'white',
        borderColor: 'white'
    },
    loadingSources: {
        marginRight: '1em',
        color: 'white',
    },
    commentContainer: {
        'MuiPaper-root': {
            borderRadius: '10px',
            background: 'none'
        }
    },
    inline: {
        display: 'inline',
    },
    popoverComment: {
        '& .MuiPopover-paper' : {
            background: 'none !important',
            borderRadius: '10px',
        }
    },
    listComment: {
        width: '100%',
        maxWidth: 360,
        borderRadius: '10px',
        background: 'radial-gradient(rgb(77, 24, 60), rgb(11, 16, 35)) !important',
        color: 'white'
    },
    listCommentUsername: {
        color: 'white',
        fontWeight: 'bold',
    },
    listCommentText: {
        color: 'white'
    },
    inputCommentContainer: {
        margin: 0,
        marginTop: '8px',
        marginBottom: '-8px',
        position: 'relative',
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 'auto',
        },
    },
    sendIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
}));

function SimpleDialog(props) {
    const classes = useStyles();
    const { onClose, selectedValue, open, movieSources } = props;

    const handleClose = () => {
        onClose(selectedValue)
    };

    const handleListItemClick = value => {
        onClose(value)
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Choose a source</DialogTitle>
            <List>
                {movieSources && movieSources.ytsInfo && Array.isArray(movieSources.ytsInfo) && movieSources.ytsInfo.map((obj, key) => (
                    <ListItem button onClick={() => handleListItemClick('yts-' + obj.quality.substring(0, obj.quality.length - 1))} key={key}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <FiberManualRecordIcon style={{ color: '#4bbe4b'}}/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${obj.quality} - ${obj.seeds} seeds / ${obj.size}`}
                        />
                    </ListItem>
                ))}
                {movieSources && movieSources.leetInfo && Array.isArray(movieSources.leetInfo) && movieSources.leetInfo.map((obj, key) => (
                    <ListItem button onClick={() => handleListItemClick('1377-' + obj.quality.substring(0, obj.quality.length - 1))} key={key}>
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <FiberManualRecordIcon style={{ color: '#4bbe4b'}} />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${obj.quality} - ${obj.seeds} seeds / ${obj.size}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

export default function MovieCard(props){
    let classes = useStyles();
    const [movieDetails, setMovieDetails] = useState(null);
    const [movieSources, setMovieSources] = useState(null);
    // Loading sources
    const [loadingSources, setLoadingSources] = useState(true);
    // Dialog
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    // Set movieSrc
    const [movieSrc, setMovieSrc] = useState(null);
    // Set subtitles
    const [subtitles, setSubtitles] = useState([]);

    // Comments
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [getComments, setComments] = React.useState([]);
    const [commentValue, setCommentValue] = React.useState([]);



    const handleGetComments = (movieID) => {
        API.getComments(movieID)
            .then(res => {
                if (res.status === 200 && res.data.commentsList) {
                    console.log(res.data);
                    setComments(res.data.commentsList)
                }
            })
    };
    const handleKeyDownComment = (e) => {
        if (e.keyCode === 13 && commentValue) {
            API.addComment(props.match.params.movieId, commentValue)
                .then(res => {
                    if (res.status === 200)
                        console.log(res.data);
                })
            setCommentValue('');
        }
    };

    // On mount (when props are received or when the page with /movie/:id is loaded
    useEffect(() => {
        const constructSubtitles = (subtitles) => {
            if (subtitles){
                let subTab = Object.entries(subtitles);
                let subObject = [];
                if (subTab && subTab.length)
                    for (let i = 0; i < subTab.length; i++){
                        let src = subTab[i][1].split('/');
                        src = src[src.length - 2].concat("/" + src[src.length -1]);
                        subObject.push(Object.assign({
                            kind: 'subtitles',
                            src: `${burl}/subtitles/${src}`,
                            srcLang: subTab[i][0],
                        }))
                    }
                return subObject;
            }
        };
        function setMovieDetail() {
            let data = null;
            axios.get(`https://api.themoviedb.org/3/movie/${props.match.params.movieId}?api_key=c91b62254304ec5dbb322351b0dc1094`)
                .then(res => {
                    if (res.data) {
                        data = res.data;
                        _mounted && setMovieDetails(data)
                    }
                });
        }
        // Get infos about movie (if available on yts, 1337...)
        function getMovieSources() {
            API.getMovieSources(props.match.params.movieId)
                .then(res => {
                    if (res.status === 200) {
                        if (res.data && (res.data.inYTS || res.data.inLeet )) {
                            _mounted && setSubtitles(constructSubtitles(res.data.subtitles));
                            _mounted && setMovieSources(res.data);
                        }
                        else
                            _mounted && setMovieSources(null);
                    }
                    else
                        _mounted && setMovieSources(null);
                    _mounted && setLoadingSources(false);
                })

        }
        let _mounted = true;
        // Get movie infos (vote, title, overview, poster...)
        if (_mounted && props.match.params.movieId) {
            setMovieDetail();
            getMovieSources();
            handleGetComments(props.match.params.movieId);
        }
        return () => { _mounted = false }
    }, [props.match.params.movieId]);




    // Movie source selection
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = value => {
        setOpen(false);
        setSelectedValue(value);
    };

    useEffect(() => {
        function streamMovie() {
            let src = null;
                let splittedValues = selectedValue.split('-');
                if (splittedValues.length > 1)
                    src = `${burl}/movies/${splittedValues[0]}/${splittedValues[1]}/${movieDetails.imdb_id}`
            setMovieSrc(src);
        }
        if (selectedValue)
            streamMovie();
    }, [selectedValue, movieDetails])

    // Movies genres generator
    const genMovieGenres = (obj) => {
        if(obj.genres && obj.genres.length)
            return obj.genres.map((genre, key) => {
                return (
                    <Grid key={key} className={classes.moviesGenres} item>
                        <span >{genre.name}</span>
                    </Grid>);
            });
        return null;
    };

    const sourceMessage = () => {
        if (movieSources)
            return selectedValue ? selectedValue : `Choose a source (${movieSources.ytsInfo.length + movieSources.leetInfo.length})`;
        else
            return 'No source available'
    };
    const poster = movieDetails && movieDetails.poster_path ? `https://image.tmdb.org/t/p/w185${movieDetails.poster_path}` : 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png';
    const movieCardContainer = () => {
        const openComment = Boolean(anchorEl);
        const id = openComment ? 'simple-popover' : undefined;
        return (
            <Grow in={true}>
                <Container>
                    <Container
                        maxWidth={'md'}
                        className={classes.containerMovieDetails}
                    >

                        <Grid style={{marginBottom: '1.5em'}} container justify={'space-between'}
                              alignItems={'flex-start'} alignContent={'center'}>
                            <Grid item xs={'auto'} className={classes.movieReturnBack}>
                                <a href={'#  '}>
                                    <ArrowBackIosIcon
                                        fontSize="large"
                                        style={{color: 'white'}}
                                        id="arrowBackIosIcon"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            props.history.push('/')
                                        }}
                                    />
                                </a>
                            </Grid>
                            <Grid item xs={'auto'} className={classes.movieAddList}>
                                <AddCircle fontSize="large" id="addCircle"/>
                            </Grid>
                        </Grid>
                        <Grid style={{marginBottom: '1.5em'}} container justify={'space-between'}
                              alignItems={'flex-end'} justify={"flex-end"}alignContent={'flex-end'}>
                            <Grid item xs={'auto'} className={classes.commentIcon}>
                                <CommentIcon onClick={handleClickComment} aria-describedby={id} fontSize="large" id="commentIcon"/>
                                <Popover
                                    id={id}
                                    open={openComment}
                                    anchorEl={anchorEl}
                                    onClose={handleCloseComment}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    className={classes.popoverComment}
                                >
                                    <List className={classes.listComment}  >
                                        <div className={classes.commentContainer}>
                                            {comments()}
                                            <div className={classes.inputCommentContainer}>
                                                <div className={classes.sendIcon}>
                                                    <SendIcon />
                                                </div>
                                                <InputBase
                                                    placeholder="Press enter to send"
                                                    classes={{root: classes.inputRoot, input: classes.inputInput }}
                                                    inputProps={{ 'aria-label': 'comment' }}
                                                    value={commentValue}
                                                    onChange={(e) => setCommentValue(e.target.value)}
                                                    onKeyDown={handleKeyDownComment}
                                                />
                                            </div>
                                        </div>
                                    </List>
                                </Popover>
                            </Grid>
                        </Grid>
                        <div
                            style={{
                                background: `url(${poster})`,
                                backgroundSize: 'contain',
                                filter: 'blur(90px) brightness(1.8)',
                                boxShadow: 'inset 1px 1px 20px rgba(0,0,0,1)',
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                zIndex: '-1',
                                opacity: '0.3'
                            }}
                        />
                        <Grid style={{marginTop: '1.5em'}} container alignContent={"center"} direction="row"
                              justify="center" alignItems="center">
                            <Grid className={classes.containerImg} item xs={'auto'} sm={4}>
                                <img
                                    className={classes.movieCoverContainer}
                                    src={poster}
                                    alt={movieDetails.title}
                                />
                            </Grid>
                            <Grid style={{paddingLeft: '1em', paddingRight: '1em'}} item xs={'auto'} sm={8}>
                                <Grid item xs={12} sm={12}>
                                    <Grid className={classes.containerDate_Vote} item xs={8}>
                                        <span
                                            className={classes.releaseDate}>{movieDetails.release_date.slice(0, 4)}</span>
                                        <StarRatings rating={movieDetails.vote_average / 2} starRatedColor="#f7c12d"
                                                     starDimension="17px" starSpacing="1.5px"/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container style={{marginTop: '1em', marginBottom: '0.5em'}}
                                              direction="row" justify="flex-start" alignItems="flex-start">
                                            {genMovieGenres(movieDetails)}
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <h1 className={classes.movieTitle}>{movieDetails.title}</h1>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <p className={classes.movieOverview}>
                                            {movieDetails.overview}
                                        </p>
                                    </Grid>
                                    <Grid style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} item
                                          xs={12}>
                                        {loadingSources ?
                                            <div className={classes.loadingSources}>
                                                <Fade in={loadingSources} unmountOnExit>
                                                    <CircularProgress style={{color: 'white'}}/>
                                                </Fade>
                                            </div> : null}
                                        <br/>
                                        <Button
                                            variant="outlined"
                                            className={classes.buttonChooseSource}
                                            onClick={handleClickOpen}
                                            disabled={!movieSources ? true : false}
                                        >
                                            {sourceMessage()}
                                        </Button>
                                        <SimpleDialog movieSources={movieSources} selectedValue={selectedValue}
                                                      open={open} onClose={handleClose}/>
                                    </Grid>

                                </Grid>
                            </Grid>
                        </Grid>
                    </Container>
                    {
                        movieSrc ?
                            <Container style={{padding: '0', marginTop: '2.5em', userSelect: 'false'}}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <div className={classes.player}>
                                            <ReactPlayer
                                                width='100%'
                                                height='100%'
                                                url={movieSrc}
                                                playing
                                                controls={true}
                                                config={{
                                                    file: {
                                                        attributes: {
                                                            crossOrigin: 'use-credentials'
                                                        },
                                                        tracks: subtitles
                                                    }
                                                }}
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                            </Container> : null
                    }
                </Container>
            </Grow>
        )
    };


    // Comment icon

    const handleClickComment = event => { setAnchorEl(event.currentTarget) };
    const handleCloseComment = () => { setAnchorEl(null) };
    const comments = () => {
        if (getComments && getComments.length){
            return getComments.map((obj, key) => {
                return (
                    <Aux key={key}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            </ListItemAvatar>
                            <ListItemText
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={classes.listCommentUsername}
                                        >
                                            {obj.user}
                                        </Typography>
                                        <span  className={classes.listCommentUsername}>
                                            {" — "}{obj.comment}
                                    </span>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        {key < getComments.length - 1 ?
                            <Divider style={{backgroundColor: '#f7c12d', opacity: '0.5'}} variant="inset" component="li" />
                            : null}
                    </Aux>
                )
            })
        }
        else
            return (
                <div className={classes.commentContainer}>
                    <p style={{ color : 'white', paddingLeft: '10px'}}>No Comments </p>
                </div>
            )
    };
    if (movieDetails) {
        return (
            <div>
                {movieCardContainer()}
            </div>
        )

    }
    return null
}