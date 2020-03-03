import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grow, Container, Paper, Grid, CircularProgress, Backdrop, Fab, useScrollTrigger, Zoom } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import AddCircle from '@material-ui/icons/AddCircle';
import StarRatings from 'react-star-ratings';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';


const useStyles = makeStyles(theme => ({
    movieCover: {
        display: 'block',
    },
    movieCoverFocus: {
        display: 'block',
        height: '100%',
        opacity: '0.5',
        // padding: '1.2em',
        transition: 'all 0.2s ease-in-out',
        webkitFilter: 'blur(15px)', /* Safari 6.0 - 9.0 */
        filter: 'blur(15px)'
    },
    movieFocusOverlay:{
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        height: '100%',
        width: '100%',
        opacity: '0',
        transition: 'all 2s',
        background: 'transparent'
    },
    movieCoverContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'inline-block',
        overflow: 'hidden',
        transition: 'all 0.2s ease-out;',
        margin: '0',
        '&:hover':{
            transform: 'scale(1.05)',
        },
        '&:hover $movieFocusOverlay':{
            opacity: '1',
            background: 'transparent',
            transition: 'all 2s ',
        }
    },
    containerGridTopMovie: {
        marginTop: theme.spacing(13),
    },
    growContainer: {
        background: 'transparent !important'
    },
    paper: {
        width: '190px !important',
        height: '280px !important',
        margin: theme.spacing(1),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    movieTitleContainer: {
        overflow: 'scroll',
        height: '50px',
        overflowY: 'hidden',
        overflowX: 'hidden'
    },
    movieTitle: {
        paddingRight: '0.9em',
        paddingLeft: '0.9em',
        color: 'white',
        margin: '0',
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
    movieRatingStars: {
        '.star': {
            fill: 'red !important',
        },
    },
    releaseDate: {
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
    topDateStarsAddContainer: {
        marginTop: '5px'
    },
    rootScroll: {
        position: 'fixed',
        zIndex: '300',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        '& .MuiFab-secondary':{
            background: 'rgba(83, 26, 62, 1)'
        }
    },
    movieOverview: {
        color: 'white',
        fontSize: '0.8em',
        textAlign: 'left',
        paddingRight: '1.2em',
        paddingLeft: '1.2em',
        lineHeight: '1.2em',
        margin: '0',
        letterSpacing: '0px',
        fontFamily: 'Open-Sans, sans-serif',
        animation: 'textdefilant 15s linear infinite',
        animationDelay: '2s',
    },
    movieOverviewNoScroll: {
        color: 'white',
        fontSize: '0.8em',
        textAlign: 'left',
        paddingRight: '1.2em',
        paddingLeft: '1.2em',
        lineHeight: '1.2em',
        margin: '0',
        letterSpacing: '0px',
    },
    movieOverviewContainer: {
        overflow: 'scroll',
        height: '90px',
        marginTop: '0.5em',
        overflowY: 'hidden',
        overflowX: 'hidden'
    },
    buttonWatch: {
        position: 'fixed',
        bottom: '0',
        color: 'white',
        right: '0',
        opacity: '0.5',
        fontSize: '2.9em',
        marginRight: '7px',
        marginBottom: '7px',
        borderRadius: '10px',
        textShadow: '0px 1px 1px rgba(50, 50, 0, 0.2)',
        boxShadow: '2px 2px 2px rgba(50, 50, 0, 0.05)',
        '&:hover': {
            opacity: '1',
            transform: 'scale(1.05)'
        },
    },
    moviesGenres: {
        background: 'linear-gradient(-317deg, rgba(32, 122, 244, 0.5) -25%, #0b1123, #0b1123 70%, rgba(240, 38, 120, 1) 160% ) !important',
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.3)',
        padding: '3px',
        paddingRight: '7px',
        paddingLeft: '7px',
        margin: '1px',
        borderRadius: '10px',
        fontSize: '0.7em',
        textShadow: '0px 1px 1px rgba(50, 50, 0, 0.2)',
        boxShadow: '2px 2px 2px rgba(50, 50, 0, 0.05)'
    },
    moviesGenreContainer: {
        marginTop: '1em',
        marginBottom: '1em',
        paddingRight: '7px',
        paddingLeft: '7px'
    },
    movieAddList: {
        opacity: '0.5',
        color: '#f7c12d',
        paddingTop: '5px',
        verticalAlign: 'middle' ,
        '&:hover': {
            opacity: '1',
            transform: 'scale(1.05)'
        }
    }
}));


export default withRouter(function Home(props) {
    const classes = useStyles();
    const [topMoviesList, setTopMoviesList] = useState(false);
    const [movieFocus, setMovieFocus] = useState(false);
    const [moviesGenres, setMoviesGenres] = useState(false);
    const [activeTextAutoScroll, setActiveTextAutoScroll] = useState(false);

    // Infinite Scroll
    const [loadMovies, setLoadMovies] = useState(false);
    const [hasMoreContent, setHasMoreContent] = useState(true);

    // Scroll options
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 200,
    });
    // Scroll handleClick
    const handleClick = event => {
        const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
        anchor && anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };


    // Movie focus
    const handleMouseEnterMovie = (key) => { setMovieFocus(key) };
    const handleMouseLeaveMovie = () => { setMovieFocus(false) };
    // Ref callback, when text overview is loaded, then check if he his too height (then set animation)
    const refText = useCallback(node => {
        if (node !== null) {
            if(node.clientHeight < node.scrollHeight)
                setActiveTextAutoScroll(false);
            else
                setActiveTextAutoScroll(true);
        }
    }, []);
    // Movies genres generator
    const genMovieGenres = (obj) => {
        if(moviesGenres && moviesGenres.length)
            return moviesGenres.map((genre) => {
                if (obj.genre_ids && Object.keys(obj.genre_ids.length))
                    return Object.keys(obj.genre_ids).map((genreO, key) => {
                        if (obj.genre_ids[key] === genre.id)
                            return key < 4 ?
                                <Grid key={key} className={classes.moviesGenres} item>
                                    <span >{genre.name}</span>
                                </Grid> : null;
                        return null
                    });
                return null
            });
        return null;
    };

    // First load (top movies)
    // Load first page of top 20 movies - Load genres IDs with Name
    useEffect(() => {
        let _mounted = true;
        async function getTopMoviesList() {
            axios.get('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=f29f2233f1aa782b0f0dc8d6d9493c64&page=1')
            .then(res => {
                if (res.data && res.data.results && res.data.results.length) {
                    _mounted && setTopMoviesList(res.data.results)
                    setHasMoreContent(1);
                }
            })
        }
        async function getMoviesGenres() {
            axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=f29f2233f1aa782b0f0dc8d6d9493c64')
            .then(res => {
                if (res.data && res.data.genres && res.data.genres.length)
                    _mounted && setMoviesGenres(res.data.genres)
            })
        }
        getMoviesGenres();
        getTopMoviesList();
        return () => {
            _mounted = false;
        }
    }, []);

    // Infinite scroll for top movies
    useEffect(() => {
        let _mounted = true;
        function loadMore() {
            let page = hasMoreContent + 1;
            axios.get(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=f29f2233f1aa782b0f0dc8d6d9493c64&page=${page}`)
                .then(res => {
                    if (res.data && res.data.results && res.data.results.length) {
                        let currentTab = topMoviesList;
                        let newTab = res.data.results;
                        _mounted && setTopMoviesList([].concat(currentTab, newTab));
                        setLoadMovies(false);
                        setHasMoreContent(page);
                    }
                })
        }
        if (_mounted && loadMovies)
            loadMore();
        return (() => {
            _mounted = false;
        })
    }, [loadMovies, hasMoreContent]);

    // Handle function when scroll is on bottom
    const handleSetLoadMovies = () => {
       if (topMoviesList && topMoviesList.length) {
           setLoadMovies(true);
       }
    };

    return (
        <Container className={classes.home} component="main">
            {/* Loader */}
            <Backdrop className={classes.backdrop} open={!topMoviesList ? true : false} >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* Scroll to top*/}
            <Zoom in={trigger}>
                <div onClick={handleClick} role="presentation" className={classes.rootScroll}>
                    <Fab color="secondary" size="small" aria-label="scroll back to top">
                        <KeyboardArrowUpIcon />
                    </Fab>
                </div>
            </Zoom>
            {/* Main div */}
            <div className={classes.containerGridTopMovie}>
                <Grid direction="row" alignItems="flex-start" justify="center" container className={classes.root} spacing={2}>
                    {topMoviesList && topMoviesList.map((obj, key) => {
                        return (
                            <Grid key={key} id={key === 1 ? "back-to-top-anchor" : null} item>
                                <Grow in={true} className={classes.growContainer}>
                                    {/* Movie Card Item*/}
                                    <Paper elevation={5} className={classes.paper}>
                                        {movieFocus !== key ?
                                            <div className={classes.movieCoverContainer} onMouseLeave={()=> handleMouseLeaveMovie(key)} onMouseEnter={() => handleMouseEnterMovie(key) }>
                                                <img
                                                    src={obj.poster_path ? `https://image.tmdb.org/t/p/w185${obj.poster_path}` : 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png'}
                                                    alt={obj.title}
                                                    className={classes.movieCover}
                                                />
                                            </div> :
                                            <div className={classes.movieCoverContainer} onMouseLeave={()=> handleMouseLeaveMovie(key)} >
                                                {/* Movie Card Focus */}
                                                <img
                                                    src={obj.poster_path ? `https://image.tmdb.org/t/p/w185${obj.poster_path}` : 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png'}
                                                    alt={obj.title}
                                                    className={classes.movieCoverFocus}
                                                />
                                                <div className={classes.movieFocusOverlay}>
                                                    <Grid alignItems="flex-start" direction="column" alignContent="flex-start" justify="center" container>
                                                        <Grid container direction="row" justify="center" alignContent="flex-start" alignItems="center">
                                                            <Grid className={classes.topDateStarsAddContainer} alignItems="center" direction="row" justify="center" container>
                                                                <Grid item xs={3}>
                                                                    <span className={classes.releaseDate}>{obj.release_date.slice(0,4)}</span>
                                                                </Grid>
                                                                <Grid item xs={6} className={classes.movieRating}>
                                                                    <StarRatings rating={obj.vote_average / 2} starRatedColor="#f7c12d" starDimension="14px" starSpacing="0.5px" />
                                                                </Grid>
                                                                <Grid item xs={'auto'} className={classes.movieAddList}>
                                                                    <AddCircle id="addCircle"/>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item>
                                                            <div className={classes.movieTitleContainer}>
                                                                <h3 className={classes.movieTitle}>{obj.title}</h3>
                                                            </div>
                                                        </Grid>
                                                        <Grid item>
                                                            <div ref={refText} className={classes.movieOverviewContainer}>
                                                                <p className={!activeTextAutoScroll ? classes.movieOverview : classes.movieOverviewNoScroll}>
                                                                    {obj.overview}
                                                                </p>
                                                            </div>
                                                        </Grid>
                                                        <Grid item className={classes.moviesGenreContainer}>
                                                            <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                                                                    {genMovieGenres(obj)}
                                                            </Grid>
                                                        </Grid>
                                                        <Grid alignItems="flex-end" direction="column" justify="flex-end" container>
                                                            <Grid item xs >
                                                                <a href={'#  '}>
                                                                    <PlayCircleFilled
                                                                        className={classes.buttonWatch}
                                                                        onClick={() => {
                                                                            props.setMovieDetails(obj);
                                                                            props.history.push(`/movie/${obj.id}`);
                                                                        }}
                                                                    />
                                                                </a>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </div>
                                        }
                                    </Paper>
                                </Grow>
                            </Grid>
                        )
                    })}
                    {/* Infinite Scroll*/}
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleSetLoadMovies}
                        hasMore={Boolean(hasMoreContent)}
                    > </InfiniteScroll>
                </Grid>
            </div>
        </Container>
    )
});