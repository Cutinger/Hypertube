import React, {useState, useEffect, useImperativeHandle, forwardRef} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import SidebarHome from '../../components/SidebarHome/SidebarHome'
import HomeMovieCards from '../../components/HomeMoviesCards/HomeMoviesCards'
import Historic from '../../components/HomeMoviesCards/Historic'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from 'axios'
import {
    Container,
    CircularProgress,
    Backdrop,
    Fab,
    useScrollTrigger,
    Zoom, Divider
} from '@material-ui/core'
import Cookies from "universal-cookie";

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
        background: 'linear-gradient(-180deg, #0d1c37 20%, rgba(0, 0, 0, 0) ) !important'
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


const Home = (forwardRef((props, ref) => {
    const classes = useStyles();
    const [topMoviesList, setTopMoviesList] = useState(false);
    const [moviesGenres, setMoviesGenres] = useState(false);
    const [sidebarQuery, setSidebarQuery] = useState(false);
    const [watchlist, setWatchlist] = useState(false);
    const [searchValue, setSearchValue] = useState(false)
    const [loadPage, setLoadPage] = useState(1);
    const [load, setLoad] = useState(false);
    const [language, setLanguage] = React.useState('us');
    const sidebarRef = React.useRef();
    const moviesCardsRef = React.useRef();

    const translate = {
        fr: {
            TopMovies: 'Top Films',
            searchTitle: 'Recherche pour '
        },
        us: {
            TopMovies: 'Top Movies',
            searchTitle: 'Search for '
        }
    }
    // Ref accessible by App.js
    useImperativeHandle(ref, () => ({
        setLanguageHandle(language) {
            setLanguage(language);
        }
    }));
    useEffect(() => {
        const cookies = new Cookies();
        const getLg = cookies.get('lg');
        if (getLg && getLg !== language) {
            setLanguage(getLg);
        }
    },[language] );

    // ScrollToTop
        const trigger = useScrollTrigger({
            disableHysteresis: true,
            threshold: 200,
        });
        const handleClick = event => {
            const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
            anchor && anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };


// // Infinite Scroll
    // Handle function when scroll is on bottom
    const handleSetLoadMovies = () => {
        if (topMoviesList && topMoviesList.length) {
            setLoadPage(loadPage + 1);
            setLoad(true);
        }
    };
    useEffect(() => {
        async function loadMore() {
            let selectQuery = sidebarQuery ? sidebarQuery : query;
            const lg = language === 'us' ? 'language=en-US' : 'language=fr-FR';
            await axios.get(`${selectQuery}${loadPage}&${lg}`)
                .then(res => {
                    if (res.data && res.data.results && res.data.results.length)
                        setTopMoviesList([].concat(topMoviesList, res.data.results));
                });
        }
        if (load) {
            loadMore();
            setLoad(false);
        }
    }, [load, topMoviesList, loadPage, sidebarQuery, language]);

    // First load (top movies)
        useEffect(() => {
            let isCancelled = false;
            const getTopMoviesList = () => {
                const lg = language === 'us' ? 'language=en-US' : 'language=fr-FR';
                axios.get(`${query}${1}&${lg}`)
                    .then(res => {
                        if (res.data && res.data.results && res.data.results.length)
                            !isCancelled && setTopMoviesList(res.data.results);
                    })
            };
            const getMoviesGenres = async() =>{
                const lg = language === 'us' ? 'language=en-US' : 'language=fr-FR';
                axios.get(`https://api.themoviedb.org/3/genre/movie/list?${lg}&api_key=${key}`)
                    .then(res => {
                        if (res.data && res.data.genres && res.data.genres.length)
                            !isCancelled && setMoviesGenres(res.data.genres)
                    })
            };
            getMoviesGenres();
            if (props.history.location.pathname === '/') {
                getTopMoviesList();
            }
            return () => { isCancelled = true }
        }, [props.history.location.pathname, language]);

    // Sidebar
    const [open, setOpen] = React.useState(false);
    const handleDrawerClose = () => setOpen(false)


    const transormWatchlist = async(watchlist) => {
        let watchlistTab = [];
        if (watchlist && watchlist.length){
            for(let i = 0; i < watchlist.length; i++){
                const lg = language === 'us' ? 'language=en-US' : 'language=fr-FR';
                await axios.get(`https://api.themoviedb.org/3/movie/${watchlist[i]}?${lg}&api_key=c91b62254304ec5dbb322351b0dc1094`)
                    .then(res => {
                        if (res.status === 200 && res.data) {
                            watchlistTab.push(res.data);
                        }
                    });
            }
        }
        setWatchlist(watchlistTab.reverse());
    };
    // Ref accessible by App.js
    useImperativeHandle(ref, () => ({
        setSidebar(bool){ setOpen(bool) },
        setSearch(query, searchValue){
            setSidebarQuery(query);
            setSearchValue(searchValue);
        },
        async getWatchlist(watchlist){
            setWatchlist(watchlist);
            await transormWatchlist(watchlist);
        },
        setLanguageHandle(language) {
            if (language){
                setLanguage(language);
                sidebarRef.current && sidebarRef.current.setLanguageHandle(language);
                moviesCardsRef.current && moviesCardsRef.current.setLanguageHandle(language);
            }
        }
    }));


    useEffect(() => {
        const cookies = new Cookies();
        const getLg = cookies.get('lg');
        if (getLg && getLg !== language) {
            setLanguage(getLg);
        }
    },[language] );

    // Receive query from SidebarHome
    const handlePushQuery = (query) => {
        if (query && query.length){
            setSidebarQuery(query);
            setLoadPage(1);
        }
    };

    useEffect(() => {
        let isCancelled = false;
        function getMoviesList() {
            axios.get(`${sidebarQuery}${loadPage}`)
                .then(res => {
                    if (res.data && res.data.results && res.data.results.length)
                        !isCancelled && setTopMoviesList(res.data.results)
                    else
                        !isCancelled && setTopMoviesList([])
                })
        };
        if (sidebarQuery)
            getMoviesList();
        return () => { isCancelled = true }
    }, [sidebarQuery, loadPage]);

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
                    ref={sidebarRef}
                    lg={language}
                    pushQuery={handlePushQuery}
                />
                <div className={classes.titleContainer}>
                    <h1 className={classes.title}>{searchValue ? `${translate[language].searchTitle} ${searchValue}` : translate[language].TopMovies}</h1>
                    <Divider className={classes.dividerTitle}/>
                </div>
                <InfiniteScroll next={handleSetLoadMovies} hasMore={true} dataLength={topMoviesList ? topMoviesList.length : 0} ></InfiniteScroll>
                {/* Movies card map */}
                <HomeMovieCards
                    ref={moviesCardsRef}
                    watchlist={watchlist}
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
                    ref={moviesCardsRef}
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
                    pushHistory={(link, e) => { e.preventDefault(); props.history.push(link) }}
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

export default Home;
