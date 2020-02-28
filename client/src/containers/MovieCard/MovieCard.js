import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, Grid, Grow } from '@material-ui/core';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AddCircle from '@material-ui/icons/AddCircle';
import ReactPlayer from "react-player";
import API from './../../utils/API';

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
    }
}));

export default function MovieCard(props){
    let classes = useStyles();
    const [movieDetails, setMovieDetails] = useState(null);
    const [movieSrc, setMovieSrc] = useState(null);

    useEffect(()=> {
        function setMovieDetail() {
            let data = null;
            axios.get(`https://api.themoviedb.org/3/movie/${props.movieDetails ? props.movieDetails.id : props.match.params.movieId}?api_key=c91b62254304ec5dbb322351b0dc1094`)
                .then(res => {
                    if (res.data)
                        data = res.data;
                    setMovieDetails(data)
                });
        }
        setMovieDetail();
    }, [props.movieDetails, props.match.params.movieId]);

    useEffect(()=> {
        async function streamMovie() {
            await API.stream('720', movieDetails.imdb_id)
                .then(res => {
                    console.log(res.data)
                })
        }
        if (movieDetails && movieDetails.id)
            streamMovie();


    }, [movieDetails]);


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
    }

    if (movieDetails) {
        const poster = movieDetails.poster_path ? `https://image.tmdb.org/t/p/w185${movieDetails.poster_path}` : 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png';
        return (
            <Grow in={true}>
                <Container
                    maxWidth={'md'}
                    className={classes.containerMovieDetails}
                >

                    <Grid  style={{ marginBottom: '1.5em'}} container justify={'space-between'} alignItems={'flex-start'} alignContent={'center'}>
                        <Grid item xs={'auto'} className={classes.movieReturnBack}>
                            <a href={'#  '}>
                                <ArrowBackIosIcon
                                    fontSize="large"
                                    style={{color: 'white'}}
                                    id="arrowBackIosIcon"
                                    onClick={() =>  props.history.push('/')}
                                />
                            </a>
                        </Grid>
                        <Grid item xs={'auto'} className={classes.movieAddList}>
                            <AddCircle fontSize="large" id="addCircle"/>
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
                    <Grid style={{ marginTop: '1.5em'}}container alignContent={"center"} direction="row" justify="center" alignItems="center">
                        <Grid className={classes.containerImg} item xs={'auto'} sm={4}>
                            <img
                                className={classes.movieCoverContainer}
                                src={poster}
                                alt={movieDetails.title}
                            />
                        </Grid>
                        <Grid style={{ paddingLeft: '1em', paddingRight: '1em'}} item xs={'auto'} sm={8}>
                            <Grid item xs={12} sm={12}>
                                <Grid className={classes.containerDate_Vote} item xs={8}>
                                    <span className={classes.releaseDate}>{movieDetails.release_date.slice(0,4)}</span>
                                    <StarRatings rating={movieDetails.vote_average / 2} starRatedColor="#f7c12d" starDimension="17px" starSpacing="1.5px" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container style={{  marginTop: '1em', marginBottom: '0.5em'}} direction="row" justify="flex-start" alignItems="flex-start">
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
                            </Grid>
                        </Grid>
                    </Grid>
                    <Container style={{padding: '0', marginTop: '2.5em'}}>
                        <Grid container>
                            <Grid item xs={12}>
                                <div className={classes.player}>
                                    <ReactPlayer  width='100%'
                                                  height='100%'
                                                  // url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
                                                  playing
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </Container>
                </Container>
            </Grow>
        );
    }
    return null
}