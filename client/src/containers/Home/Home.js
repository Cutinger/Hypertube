import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import SidebarHome from '../../components/SidebarHome/SidebarHome'
import HomeMovieCards from '../../components/HomeMoviesCards/HomeMoviesCards'
import axios from 'axios'
import {
    Container,
    CircularProgress,
    Backdrop,
    Fab,
    useScrollTrigger,
    Zoom
} from '@material-ui/core'


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

const query = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=f29f2233f1aa782b0f0dc8d6d9493c64&page='

const App = (forwardRef((props, ref) => {
    const classes = useStyles();
    const [hasMoreContent, setHasMoreContent] = useState(0);
    const [topMoviesList, setTopMoviesList] = useState(false);
    const [moviesGenres, setMoviesGenres] = useState(false);
    // const [load, setLoad] = useState(false);
    const [sidebarQuery, setSidebarQuery] = useState(false);
    // const [defaultQuery] = useState(query)

    // First load (top movies)
    useEffect(() => {
        let isCancelled = false;
        async function getTopMoviesList() {
            axios.get(`${query}${1}`)
                .then(res => {
                    if (res.data && res.data.results && res.data.results.length)
                        !isCancelled && setTopMoviesList(res.data.results);
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
        console.log(1);
        return () => { isCancelled = true }
    }, []);


    // // Infinite Scroll
    // // Handle function when scroll is on bottom
    // const handleSetLoadMovies = () => {
    //     if (topMoviesList && topMoviesList.length) {
    //         setLoad(true);
    //         setHasMoreContent(hasMoreContent + 1)
    //     }
    // };
    // useEffect(() => {
    //     let _mounted = true;
    //     function loadMore() {
    //         console.log(1);
    //         axios.get(`${defaultQuery}${hasMoreContent}`)
    //             .then(res => {
    //                 if (res.data && res.data.results && res.data.results.length)
    //                     _mounted && setTopMoviesList([].concat(topMoviesList, res.data.results));
    //             })
    //     }
    //     if (_mounted && load){
    //         loadMore();
    //     }
    //     return (() => {
    //         _mounted = false;
    //     })
    // }, [hasMoreContent, load, topMoviesList, defaultQuery]);

    // Sidebar
    const [open, setOpen] = React.useState(false);
    const handleDrawerClose = () => setOpen(false)
    // Ref accessible by App.js
    useImperativeHandle(ref, () => ({
        setSidebar(bool){
            setOpen(bool);
        }
    }));
    // Receive query from SidebarHome
    const handlePushQuery = (query) => query && query.length && setSidebarQuery(query);

    useEffect(() => {
        let isCancelled = false;
        function getMoviesList() {
            axios.get(sidebarQuery)
                .then(res => {
                    if (res.data && res.data.results && res.data.results.length) {
                        !isCancelled && setTopMoviesList(res.data.results)
                        !isCancelled && setHasMoreContent(0);
                    }
                })
        }
        if (sidebarQuery)
            getMoviesList();
        return () => { isCancelled = true }
    }, [sidebarQuery]);


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
                pushQuery={handlePushQuery}
            />
            {/* Movies card map */}
            <HomeMovieCards
                topMoviesList={topMoviesList}
                moviesGenres={moviesGenres}
                pushHistory={(link) => props.history.push(link)}
                setLoad={() => console.log(1)}
            />
             Scroll to top
            <Zoom in={trigger}>
                <div onClick={handleClick} role="presentation" className={classes.rootScroll}>
                    <Fab color="secondary" size="small" aria-label="scroll back to top">
                        <KeyboardArrowUpIcon />
                    </Fab>
                </div>
            </Zoom>
        </Container>
    )
}));

export default App;
