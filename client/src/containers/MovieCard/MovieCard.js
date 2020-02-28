import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Container, Grid, Grow } from '@material-ui/core';
import StarRatings from 'react-star-ratings';
import axios from 'axios';

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
    },
    containerImg: {
        textAlign: 'left',
    },
    moviesGenres: {
        background: 'linear-gradient(-317deg, rgba(32, 122, 244, 0.5) -25%, #0b1123, #0b1123 70%, rgba(240, 38, 120, 1) 160% ) !important',
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.3)',
        padding: '3px',
        paddingRight: '7px',
        paddingLeft: '9px',
        marginRight: '6px',
        borderRadius: '10px',
        fontSize: '0.8em',
        textShadow: '0px 1px 1px rgba(50, 50, 0, 0.2)',
        boxShadow: '2px 2px 2px rgba(50, 50, 0, 0.05)',
        marginTop: '1em',
        minWidth: '0.8em',
        marginBottom: '1em'
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
}
}));

export default function MovieCard(props){
    let classes = useStyles();
    const [movieDetails, setMovieDetails] = useState(null);

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
            <Container
                maxWidth={'md'}
                className={classes.containerMovieDetails}
            >
                <Grow in={true}>
                    <div
                        style={{
                            background: `url(${poster})`,
                            backgroundSize: 'contain',
                            filter: 'blur(60px) brightness(1.8)',
                            boxShadow: 'inset 1px 1px 1px rgba(0,0,0,0.5)',
                            width: '90%',
                            height: '90%',
                            position: 'absolute',
                            zIndex: '-1',
                            opacity: '0.4'
                        }}
                    />
                        <Grid container alignContent={"center"} direction="row" justify="center" alignItems="center">
                            <Grid className={classes.containerImg} item xs={'auto'} sm={4}>
                                <img
                                    className={classes.movieCoverContainer}
                                    src={poster}
                                    alt={movieDetails.title}
                                />
                            </Grid>
                            <Grid style={{ padding: '1em'}} item xs={'auto'} sm={8}>
                                <Grid item xs={12} sm={12}>
                                    <Grid className={classes.containerDate_Vote} item xs={6}>
                                        <span className={classes.releaseDate}>{movieDetails.release_date.slice(0,4)}</span>
                                        <StarRatings rating={movieDetails.vote_average / 2} starRatedColor="#f7c12d" starDimension="17px" starSpacing="1.5px" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container direction="row" justify="flex-start" alignItems="flex-start">
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
                </Grow>
            </Container>
        );
    }
    return null
}