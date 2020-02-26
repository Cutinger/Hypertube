import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grow, Container, Paper, Grid, CircularProgress, Backdrop } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    movieCover: {
        backgroundColor: 'white',
        minHeight: '100%',
        minWidth: '100%',
        transform: 'translate(-50%, -50%)',
        display: 'block',
        position: 'absolute',
        top: '50%',
        left: '50%'
    },
    movieCoverFocus: {
        backgroundColor: 'white',
        minHeight: '100%',
        minWidth: '100%',
        transform: 'translate(-50%, -50%)',
        display: 'block',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transition: 'all 0.2s ease-in-out',
        webkitFilter: 'blur(10px)', /* Safari 6.0 - 9.0 */
        filter: 'blur(10px)'
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
            zIndex: '500'
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
        console.log(1);
    }, []);

    const handleMouseEnterMovie = (key) => {
        setMovieFocus(key);
    }
    return (
        <Container className={classes.home} component="main">
            <Backdrop className={classes.backdrop} open={!topMoviesList ? true : false} >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className={classes.containerGridTopMovie}>
                <Grid direction="row" alignItems="flex-start" justify="center" container className={classes.root} spacing={2}>
                    {topMoviesList && topMoviesList.map((obj, key) => {
                        const timeout = "00";
                        const valueTimeout = key.toString();
                        return (
                            <Grid key={key} item>
                                <Grow 
                                    in={true}
                                    style={key > 1 ? { transformOrigin: '0 0 0' } : {}} 
                                    {...({ timeout: parseInt(valueTimeout.concat(timeout)) })}
                                    className={classes.growContainer} 
                                >
                                    <Paper elevation={5} className={classes.paper}>
                                        {movieFocus !== key ? 
                                            <div className={classes.movieCoverContainer} onMouseEnter={() => handleMouseEnterMovie(key)}>
                                                <img
                                                    src={obj.poster_path ? `http://image.tmdb.org/t/p/w185${obj.poster_path}` : 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png'}
                                                    alt={obj.title}
                                                    className={classes.movieCover}
                                                />
                                            </div> :
                                            <div className={classes.movieCoverContainer}>
                                                <img
                                                    src={obj.poster_path ? `http://image.tmdb.org/t/p/w185${obj.poster_path}` : 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png'}
                                                    alt={obj.title}
                                                    className={classes.movieCoverFocus}
                                                />
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