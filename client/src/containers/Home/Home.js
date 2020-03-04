import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import {
    Grow,
    Container,
    Paper,
    Grid,
    CircularProgress,
    Backdrop,
    Fab,
    useScrollTrigger,
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
    },
    drawerPaper:{
        background: 'linear-gradient(-333deg, rgba(32, 122, 244, 0.8) -39%, #0b1123, #0b1123 70%, rgba(240, 38, 120, 0.8) 223% ) !important',
        opacity: '0.9',
        boxShadow: '1px -7px 22px 11px rgba(0,0,0,0.5)'
    },
    drawerHeader:{
        display: 'flex',
        alignContent: 'end',
        justifyContent: 'flex-end'
    },
    sidebarHomeContainer: {
        width: '15em',
        padding: '1.5em'
    },
    actorResearch: {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
              borderRadius: '10px',
              opacity: '0',
              color: 'white'
            }
        },
        '& input::placeholder': {
            color: 'white'
        },
        '& .MuiSvgIcon-root': {
            color: 'white'
        }
    },
    buttonSearch: {
        color: 'white',
        background: '#3f51b5',
        '&:hover': {
            background: '#344594',
        }
    }
}));


const PrettoSlider = withStyles({
    root: {
        backgroundColor: 'linear-gradient(-333deg, rgba(32, 122, 244, 0.8) -39%, #0b1123, #0b1123 70%, rgba(240, 38, 120, 0.8) 223% ) !important',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus,&:hover,&$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        fontSize: '0.8em',
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
        
    },
    rail: {

        height: 8,
        borderRadius: 4,
    },
})(Slider);


export default withRouter(function Home(props) {
    const classes = useStyles();
    const [topMoviesList, setTopMoviesList] = useState(false);
    const [movieFocus, setMovieFocus] = useState(false);
    const [moviesGenres, setMoviesGenres] = useState(false);
    const [activeTextAutoScroll, setActiveTextAutoScroll] = useState(false);

    // Infinite Scroll
    const [loadMovies, setLoadMovies] = useState(false);
    const [hasMoreContent, setHasMoreContent] = useState(true);
    const [open, setOpen] = React.useState(true);
    const theme = useTheme();
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
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
    }, [loadMovies, hasMoreContent, topMoviesList]);

    // Handle function when scroll is on bottom
    const handleSetLoadMovies = () => {
       if (topMoviesList && topMoviesList.length) {
           setLoadMovies(true);
       }
    };

    const Sidebar = () => {
        const classes = useStyles();

        return (
        <SwipeableDrawer
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
            onClose={handleDrawerClose}
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon style={{color: 'white'}} fontSize="large"/> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider style={{backgroundColor: 'transparent'}}/>
            <div className={classes.sidebarHomeContainer}>
                <Typography gutterBottom style={{color: 'white'}}>Year</Typography>
                <PrettoSlider valueLabelDisplay="auto" min={1910} max={2020} defaultValue={2019}/>
                <Typography gutterBottom style={{color: 'white'}}>Vote</Typography>
                <PrettoSlider valueLabelDisplay="auto" min={0} max={5} defaultValue={5} step={1} />
                <Typography gutterBottom style={{color: 'white'}}>With actor(s)</Typography>
                <Autocomplete
                    style={{color: 'white'}}
                    multiple
                    id="tags-outlined"
                    options={top100Films}
                    getOptionLabel={option => option.title}
                    filterSelectedOptions
                    renderInput={params => (
                    <TextField
                        {...params}
                        className={classes.actorResearch}
                        variant="outlined"
                        placeholder="Favorites"
                    />
                    )}
                />
                <Grid container alignContent={"center"}>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            className={classes.buttonSearch}
                        >
                            Search
                        </Button>

                    </Grid>
                </Grid>
            </div>
        </SwipeableDrawer>)
    }

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
            {Sidebar()}
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

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
    { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
    { title: 'Casablanca', year: 1942 },
    { title: 'City Lights', year: 1931 },
    { title: 'Psycho', year: 1960 },
    { title: 'The Green Mile', year: 1999 },
    { title: 'The Intouchables', year: 2011 },
    { title: 'Modern Times', year: 1936 },
    { title: 'Raiders of the Lost Ark', year: 1981 },
    { title: 'Rear Window', year: 1954 },
    { title: 'The Pianist', year: 2002 },
    { title: 'The Departed', year: 2006 },
    { title: 'Terminator 2: Judgment Day', year: 1991 },
    { title: 'Back to the Future', year: 1985 },
    { title: 'Whiplash', year: 2014 },
    { title: 'Gladiator', year: 2000 },
    { title: 'Memento', year: 2000 },
    { title: 'The Prestige', year: 2006 },
    { title: 'The Lion King', year: 1994 },
    { title: 'Apocalypse Now', year: 1979 },
    { title: 'Alien', year: 1979 },
    { title: 'Sunset Boulevard', year: 1950 },
    { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
    { title: 'The Great Dictator', year: 1940 },
    { title: 'Cinema Paradiso', year: 1988 },
    { title: 'The Lives of Others', year: 2006 },
    { title: 'Grave of the Fireflies', year: 1988 },
    { title: 'Paths of Glory', year: 1957 },
    { title: 'Django Unchained', year: 2012 },
    { title: 'The Shining', year: 1980 },
    { title: 'WALL·E', year: 2008 },
    { title: 'American Beauty', year: 1999 },
    { title: 'The Dark Knight Rises', year: 2012 },
    { title: 'Princess Mononoke', year: 1997 },
    { title: 'Aliens', year: 1986 },
    { title: 'Oldboy', year: 2003 },
    { title: 'Once Upon a Time in America', year: 1984 },
    { title: 'Witness for the Prosecution', year: 1957 },
    { title: 'Das Boot', year: 1981 },
    { title: 'Citizen Kane', year: 1941 },
    { title: 'North by Northwest', year: 1959 },
    { title: 'Vertigo', year: 1958 },
    { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
    { title: 'Reservoir Dogs', year: 1992 },
    { title: 'Braveheart', year: 1995 },
    { title: 'M', year: 1931 },
    { title: 'Requiem for a Dream', year: 2000 },
    { title: 'Amélie', year: 2001 },
    { title: 'A Clockwork Orange', year: 1971 },
    { title: 'Like Stars on Earth', year: 2007 },
    { title: 'Taxi Driver', year: 1976 },
    { title: 'Lawrence of Arabia', year: 1962 },
    { title: 'Double Indemnity', year: 1944 },
    { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
    { title: 'Amadeus', year: 1984 },
    { title: 'To Kill a Mockingbird', year: 1962 },
    { title: 'Toy Story 3', year: 2010 },
    { title: 'Logan', year: 2017 },
    { title: 'Full Metal Jacket', year: 1987 },
    { title: 'Dangal', year: 2016 },
    { title: 'The Sting', year: 1973 },
    { title: '2001: A Space Odyssey', year: 1968 },
    { title: "Singin' in the Rain", year: 1952 },
    { title: 'Toy Story', year: 1995 },
    { title: 'Bicycle Thieves', year: 1948 },
    { title: 'The Kid', year: 1921 },
    { title: 'Inglourious Basterds', year: 2009 },
    { title: 'Snatch', year: 2000 },
    { title: '3 Idiots', year: 2009 },
    { title: 'Monty Python and the Holy Grail', year: 1975 },
  ];