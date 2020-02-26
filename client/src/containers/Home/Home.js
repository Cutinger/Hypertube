import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grow, Container, Paper, Grid, CircularProgress, Backdrop, Fab, useScrollTrigger, Zoom } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import StarRatings from 'react-star-ratings';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    movieCover: {
        display: 'block',
        // width: '100%',
        height: '100%'
    },
    movieCoverFocus: {
        display: 'block',
        // width: '100%',
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
        opacity: '0',
        transition: 'all 0.2s ease-in-out',
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
            opacity: '1'
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
        padding: '1em',
        color: 'white',
        textShadow: '1px 1px 5px rgba(0,0,0,0.7)'
    },
    movieRating: {
        marginTop: '-2em',
        '& .star': {
            'filter': 'drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5))'
        },
        '& svg':{
            'filter': 'drop-shadow(3px 3px 2px rgba(50, 50, 0, 0.2))'
        }
    },
    movieRatingStars: {
        '.star': {
            fill: 'red !important',
        },
    },
    rootScroll: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        '& .MuiFab-secondary':{
            background: 'rgba(83, 26, 62, 1)'
        }
      },
}));

export default function Home(props) {
    const classes = useStyles();
    const [topMoviesList, setTopMoviesList] = useState(false);
    const [movieFocus, setMovieFocus] = useState(false);

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
    const handleMouseEnterMovie = (key) => { setMovieFocus(key) }
    const handleMouseLeaveMovie = (key) => { setMovieFocus(false) }

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
                                            <div className={classes.movieCoverContainer} onMouseLeave={()=> handleMouseLeaveMovie(key)} onMouseEnter={() => handleMouseEnterMovie(key) }>
                                                <img
                                                    src={obj.poster_path ? `http://image.tmdb.org/t/p/w185${obj.poster_path}` : 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png'}
                                                    alt={obj.title}
                                                    className={classes.movieCover}
                                                />
                                            </div> :
                                            <div className={classes.movieCoverContainer} onMouseLeave={()=> handleMouseLeaveMovie(key)} onMouseEnter={() => handleMouseEnterMovie(key) }>
                                                <img
                                                    src={obj.poster_path ? `http://image.tmdb.org/t/p/w185${obj.poster_path}` : 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png'}
                                                    alt={obj.title}
                                                    className={classes.movieCoverFocus}
                                                />
                                                <div className={classes.movieFocusOverlay}>
                                                    <Grid alignItems="center" direction="column" justify="center" container>
                                                        <Grid item>
                                                            <h3 className={classes.movieTitle}>{obj.title}</h3>
                                                        </Grid>
                                                        <Grid item className={classes.movieRating}>
                                                            <StarRatings
                                                                rating={obj.vote_average / 2}
                                                                starRatedColor="#f7c12d"
                                                                starDimension="18px"
                                                                starSpacing="3px"
                                                            />
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