import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grow, Container, Paper, Grid, CircularProgress, Backdrop, Fab, useScrollTrigger, Zoom } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import StarRatings from 'react-star-ratings';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    movieCover: {
        display: 'block',
        height: '100%'
    },
    movieCoverFocus: {
        display: 'block',
        height: '100%',
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
        transition: 'all 2s ease-in-out',
        opacity: '0',

    },
    movieCoverContainer: {
        width: '190px',
        height: '280px',
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
            transition: 'all 2s ease-in-out',
        }
    },
    containerGridTopMovie: {
        marginTop: theme.spacing(13),
    },
    growContainer: {
        background: 'transparent !important'
    },
    paper: {
        margin: theme.spacing(1),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
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
        border: '1px solid white',
        borderRadius: '10px',
        fontSize: '0.8em',
        textShadow: '0px 1px 1px rgba(50, 50, 0, 0.2)',
        boxShadow: '2px 2px 2px rgba(50, 50, 0, 0.05)'
    },
    topRateDate: {
      padding: '10px'
    },
    rootScroll: {
        position: 'fixed',
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
        animation: 'textdefilant 15s linear infinite',
        animationDelay: '2s'
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
        marginTop: '0.5em'
    },
    movieTitleContainer: {
        overflow: 'scroll',
        height: '50px',
    }
}));

export default function Home(props) {
    const classes = useStyles();
    const [topMoviesList, setTopMoviesList] = useState(false);
    const [movieFocus, setMovieFocus] = useState(false);
    const [activeTextAutoScroll, setActiveTextAutoScroll] = useState(false);

    useEffect(() => {
        function getTopMoviesList() {
            axios.get('http://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=f29f2233f1aa782b0f0dc8d6d9493c64&language=fr&page=1')
            .then(res => {
                if (res.data && res.data.results && res.data.results.length)
                    setTopMoviesList(res.data.results)
            })
        }
        getTopMoviesList();
    }, []);


    // Movie focus
    const handleMouseEnterMovie = (key) => { setMovieFocus(key) };
    const handleMouseLeaveMovie = () => { setMovieFocus(false) };

    // Scroll options
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 200,
    });
    
    const handleClick = event => {
        const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
        anchor && anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });

    };

    return (
        <Container className={classes.home} component="main">
            <Backdrop className={classes.backdrop} open={!topMoviesList ? true : false} >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Zoom in={trigger}>
                <div onClick={handleClick} role="presentation" className={classes.rootScroll}>
                    <Fab color="secondary" size="small" aria-label="scroll back to top">
                        <KeyboardArrowUpIcon />
                    </Fab>
                </div>
            </Zoom>
            <div className={classes.containerGridTopMovie}>
                <Grid direction="row" alignItems="flex-start" justify="center" container className={classes.root} spacing={2}>
                    {topMoviesList && topMoviesList.map((obj, key) => {
                        const timeout = "00";
                        const valueTimeout = key.toString();
                        return (
                            <Grid key={key} id={key === 1 ? "back-to-top-anchor" : null} item>
                                <Grow 
                                    in={true}
                                    style={key > 1 ? { transformOrigin: '0 0 0' } : {}} 
                                    {...({ timeout: parseInt(valueTimeout.concat(timeout)) })}
                                    className={classes.growContainer} 
                                >
                                    <Paper elevation={5} className={classes.paper}>
                                        {movieFocus !== key ?
                                            // MOVIE CARD
                                            <div className={classes.movieCoverContainer} onMouseLeave={()=> handleMouseLeaveMovie(key)} onMouseEnter={() => handleMouseEnterMovie(key) }>
                                                <img
                                                    src={obj.poster_path ? `http://image.tmdb.org/t/p/w185${obj.poster_path}` : 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png'}
                                                    alt={obj.title}
                                                    className={classes.movieCover}
                                                />
                                            </div> :
                                            // FOCUS MOVIE CARD
                                            <div className={classes.movieCoverContainer} onMouseLeave={()=> handleMouseLeaveMovie(key)} >
                                                <img
                                                    src={obj.poster_path ? `http://image.tmdb.org/t/p/w185${obj.poster_path}` : 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png'}
                                                    alt={obj.title}
                                                    className={classes.movieCoverFocus}
                                                />
                                                <div className={classes.movieFocusOverlay}>
                                                    <Grid alignItems="flex-start" direction="column" justify="center" container>
                                                        <Grid className={classes.topRateDate} alignItems="center" direction="row" justify="space-between" container>
                                                            <Grid item xs={3}>
                                                                <span className={classes.releaseDate}>{obj.release_date.slice(0,4)}</span>
                                                            </Grid>
                                                            <Grid item xs={6} className={classes.movieRating}>
                                                                <StarRatings
                                                                    rating={obj.vote_average / 2}
                                                                    starRatedColor="#f7c12d"
                                                                    starDimension="14px"
                                                                    starSpacing="0.5px"
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item>
                                                            <div className={classes.movieTitleContainer}>
                                                                <h3 className={classes.movieTitle}>{obj.title}</h3>
                                                            </div>
                                                        </Grid>
                                                        <Grid item>
                                                            <div  className={classes.movieOverviewContainer}>
                                                                <p
                                                                    className={activeTextAutoScroll ? classes.movieOverview : classes.movieOverviewNoScroll}>
                                                                    {obj.overview}
                                                                </p>
                                                            </div>
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
                </Grid>
            </div>
        </Container>
    )
}