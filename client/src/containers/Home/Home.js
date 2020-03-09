import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import SidebarHome from '../../components/SidebarHome/SidebarHome'
import HomeMovieCards from '../../components/HomeMoviesCards/HomeMoviesCards'
import Historic from '../../components/HomeMoviesCards/Historic'

import axios from 'axios'
import {
    Container,
    CircularProgress,
    Backdrop,
    Fab,
    useScrollTrigger,
    Zoom, Divider, Drawer
} from '@material-ui/core'
import API from "../../utils/API";

const key = 'f29f2233f1aa782b0f0dc8d6d9493c64';
const useStyles = makeStyles(theme => ({
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
    },
    containerGridTopMovie: {
        marginTop: theme.spacing(8)
    },
    title: {
        marginBottom: '0',
        textAlign: 'left',
        color: 'white',
        fontSize: '2.2em',
        fontWeight: '100',
        fontFamily: 'Open-Sans, sans-serif',
        textShadow: '6px 12px 22px #bd20857a'
    },
    titleContainer: {
        padding: '8px',

    },
    topBackground: {
        position: 'absolute',
        top: '0',
        left: '0',
        height: '250px',
        width: '100%',
        zIndex: -1,
        background: 'linear-gradient(-180deg, rgb(13, 28, 55), rgba(240, 38, 120, 0) ) !important'
    },
    dividerTitle: {
        background: 'linear-gradient(-90deg, #3f51b5, rgba(255,255,255,0))',
        marginBottom : '1.5em',
        paddingTop: '1.5px',
        borderRadius: '10px',
        opacity: '0.25',
        boxShadow: '6px 12px 22px #bd20857a'



    }
}));

const query = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${key}&page=`


const App = (forwardRef((props, ref) => {
    const classes = useStyles();
    const [topMoviesList, setTopMoviesList] = useState(false);
    const [moviesGenres, setMoviesGenres] = useState(false);
    const [sidebarQuery, setSidebarQuery] = useState(false);
    const [watchlist, setWatchlist] = useState(false);

    // ScrollToTop
        const trigger = useScrollTrigger({
            disableHysteresis: true,
            threshold: 200,
        });
        const handleClick = event => {
            const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
            anchor && anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };




    // First load (top movies)
        useEffect(() => {
            let isCancelled = false;
            let watchlistTab = [];
            const transormWatchlist = async(watchlist) => {
                if (watchlist && watchlist.length){
                    for(let i = 0; i < watchlist.length; i++){
                      await axios.get(`https://api.themoviedb.org/3/movie/${watchlist[i]}?api_key=c91b62254304ec5dbb322351b0dc1094`)
                          .then(res => {
                              if (res.status === 200 && res.data) {
                                  watchlistTab.push(res.data);
                              }
                          });
                  }
                }
                setWatchlist(watchlistTab.reverse());
            };
            const getWatchlist = () => {
                API.getWatchlist()
                    .then(async(res) => {
                        if (res.status === 200 && res.data.watchlist && res.data.watchlist.length) {
                            !isCancelled && await transormWatchlist(res.data.watchlist);
                        }
                        else
                            setWatchlist([])

                    })
                    .catch(err => console.log(err));
            };
            const getTopMoviesList = () => {
                axios.get(`${query}${1}`)
                    .then(res => {
                        if (res.data && res.data.results && res.data.results.length)
                            !isCancelled && setTopMoviesList(res.data.results);
                    })
            };
            const getMoviesGenres = async() =>{
                axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${key}`)
                    .then(res => {
                        if (res.data && res.data.genres && res.data.genres.length)
                            !isCancelled && setMoviesGenres(res.data.genres)
                    })
            };
            getMoviesGenres();
            if (props.history.location.pathname === '/')
                getTopMoviesList();
            else {
                getWatchlist();
            }

            return () => { isCancelled = true }
        }, [props.history.location.pathname]);

    // Sidebar
    const [open, setOpen] = React.useState(false);
    const handleDrawerClose = () => setOpen(false)
    // Ref accessible by App.js
    useImperativeHandle(ref, () => ({
        setSidebar(bool){ setOpen(bool) },
        setSearch(movies){ setTopMoviesList(movies) }
    }));

    // Receive query from SidebarHome
    const handlePushQuery = (query) => query && query.length && setSidebarQuery(query);

    useEffect(() => {
        let isCancelled = false;
        async function getMoviesList() {
            axios.get(sidebarQuery)
                .then(res => {
                    if (res.data && res.data.results && res.data.results.length)
                        !isCancelled && setTopMoviesList(res.data.results)
                })
        };
        if (sidebarQuery)
            getMoviesList();
        return () => { isCancelled = true }
    }, [sidebarQuery]);



    return (
        props.history.location.pathname === "/" ?
            <Container component="main" className={classes.containerGridTopMovie}>
                <div className={classes.topBackground} />
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
                <div className={classes.titleContainer}>
                    <h1 className={classes.title}>Top Movies</h1>
                    <Divider className={classes.dividerTitle}/>
                </div>
                {/* Movies card map */}
                <HomeMovieCards
                    topMoviesList={topMoviesList}
                    moviesGenres={moviesGenres}
                    pushHistory={(link) => props.history.push(link)}
                />
                {/* Scroll to top */}
                <Zoom in={trigger}>
                    <div onClick={handleClick} role="presentation" className={classes.rootScroll}>
                        <Fab color="secondary" size="small" aria-label="scroll back to top">
                            <KeyboardArrowUpIcon />
                        </Fab>
                    </div>
                </Zoom>
            </Container> :
            <Container component="main" className={classes.containerGridTopMovie}>
                <div className={classes.topBackground} />
                {/* Loader -> when page load */}
                <Backdrop className={classes.backdrop} open={watchlist ? false : true} >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <div className={classes.titleContainer}>
                    <h1 className={classes.title}>Watch list</h1>
                    {watchlist && watchlist.length < 1 ?
                        <p style={{
                            color: 'white',
                        }}>
                            No movies in watch list
                        </p> : null}
                    <Divider className={classes.dividerTitle}/>
                </div>
                {/* Movies card map */}
                <Historic
                    topMoviesList={watchlist}
                    moviesGenres={moviesGenres}
                    pushHistory={(link) => props.history.push(link)}
                />
                <div className={classes.titleContainer}>
                    <h1 className={classes.title}>Recent views</h1>
                    <Divider className={classes.dividerTitle}/>
                </div>
                {/* Movies card map */}
                <Historic
                    topMoviesList={watchlist}
                    moviesGenres={moviesGenres}
                    pushHistory={(link) => props.history.push(link)}
                />
                {/* Scroll to top */}
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
