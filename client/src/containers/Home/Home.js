import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import InfiniteScroll from 'react-infinite-scroller'
import SidebarHome from '../../components/SidebarHome/SidebarHome'
import HomeMovieCards from '../../components/HomeMoviesCards/HomeMoviesCards'
import axios from 'axios'
import {
    Container,
    CircularProgress,
    Backdrop,
    Fab,
    useScrollTrigger,
<<<<<<< HEAD
    Zoom
} from '@material-ui/core'
=======
    Zoom,
    Typography,
    TextField,
    Button
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import AddCircle from '@material-ui/icons/AddCircle';
import StarRatings from 'react-star-ratings';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Slider from '@material-ui/core/Slider';
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
>>>>>>> c5f7585a6334dd8d8b38e5ba015ca2a25803e129


const useStyles = makeStyles(theme => ({
    containerGridTopMovie: {
        marginTop: theme.spacing(13),
    },
    paper: {
        width: '190px !important',
        height: '280px !important',
        margin: theme.spacing(1)
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    },
    rootScroll: {
        position: 'fixed',
        zIndex: '300',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        '& .MuiFab-secondary':{
            background: 'rgba(83, 26, 62, 1)'
        }
    }
}));


const App = (forwardRef((props, ref) => {
    const classes = useStyles();
    const [topMoviesList, setTopMoviesList] = useState(false);
    const [moviesGenres, setMoviesGenres] = useState(false);

    // First load (top movies)
        useEffect(() => {
            let isCancelled = false;
            async function getTopMoviesList() {
                axios.get('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=f29f2233f1aa782b0f0dc8d6d9493c64&page=1')
                .then(res => {
                    if (res.data && res.data.results && res.data.results.length) {
                        !isCancelled && setTopMoviesList(res.data.results)
                        !isCancelled && setHasMoreContent(1);
                    }
                })
            }
            async function getMoviesGenres() {
                axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=f29f2233f1aa782b0f0dc8d6d9493c64')
                .then(res => {
                    if (res.data && res.data.genres && res.data.genres.length)
                        !isCancelled && setMoviesGenres(res.data.genres)
                })
            }
            getMoviesGenres();
            getTopMoviesList();
            return () => {
                isCancelled = true;
            }
        }, []);

    // Infinite Scroll
        const [loadMovies, setLoadMovies] = useState(false);
        const [hasMoreContent, setHasMoreContent] = useState(true);
        // Handle function when scroll is on bottom
            const handleSetLoadMovies = () => {
                if (topMoviesList && topMoviesList.length)
                    setLoadMovies(true);
            };
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
            }, [loadMovies, hasMoreContent, topMoviesList]);

    // Sidebar
        const [open, setOpen] = React.useState(false);
        const handleDrawerClose = () => setOpen(false)
        useImperativeHandle(ref, () => ({
            setSidebar(bool){
                setOpen(bool);
            }
        }));

    // ScrollToTop
        const trigger = useScrollTrigger({
            disableHysteresis: true,
            threshold: 200,
        });
        const handleClick = event => {
            const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
            anchor && anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };

    
    return (
        <Container component="main">
            {/* Loader -> when page load */}
            <Backdrop className={classes.backdrop} open={!topMoviesList ? true : false} >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* Sidebar -> App.js send props here, then home send props to sidebar */}
            <SidebarHome 
                sidebarClose={handleDrawerClose} 
                sidebarActive={open}
                genres={moviesGenres}
            />
            {/* Movies card map */}
            <HomeMovieCards 
                topMoviesList={topMoviesList} 
                moviesGenres={moviesGenres}
                pushHistory={(link) => props.history.push(link)}
            />
             {/* Scroll to top*/}
             <Zoom in={trigger}>
                <div onClick={handleClick} role="presentation" className={classes.rootScroll}>
                    <Fab color="secondary" size="small" aria-label="scroll back to top">
                        <KeyboardArrowUpIcon />
                    </Fab>
                </div>
            </Zoom>
             {/* Infinite Scroll*/}
            <InfiniteScroll
                        pageStart={0}
                        loadMore={handleSetLoadMovies}
                        hasMore={Boolean(hasMoreContent)}
            > </InfiniteScroll>
        </Container>
    )
}));

export default App;
