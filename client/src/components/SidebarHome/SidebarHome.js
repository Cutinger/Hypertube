import React, { useEffect, useState} from 'react';
import { 
    Drawer, 
    Button, 
    Slider, 
    Typography, 
    IconButton,
    TextField,
    Grid,
    Divider, 
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles(theme => ({
    drawerPaper:{
        background: 'linear-gradient(-333deg, rgba(32, 122, 244, 0.8) -39%, #0b1123, #0b1123 70%, rgba(240, 38, 120, 0.8) 223% ) !important',
        opacity: '0.95',
        boxShadow: '1px -7px 22px 11px rgba(0,0,0,0.5)'
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

function SidebarHome(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [genres, setGenres] = useState([]);
    const [yearValue, setYearValue] = useState(2019);
    const [voteValue, setVoteValue] = useState(5);
    const [genreValues, setGenresValue] = useState([])

    
    // Receive active (bool) from Parent (Menu --> App --> Home)
    useEffect(() => {
        function setSidebar() {
            setOpen(props.sidebarActive)
        }
        setSidebar();
        
    }, [props.sidebarActive]);

    // Receive genres list from Parent (Home)
        useEffect(() => {
            function getGenres(){
                if (props.genres && genres !== props.genres)
                    setGenres(props.genres)
            }
            getGenres();
        }, [props.genres, genres])

    // Handle changes genres
        const handleGenresChange = (event, newValue) => { newValue !== voteValue && setGenresValue(newValue) };
    // Handle changes sliders
        // Vote handle change
        const handleVoteChange = (event, newValue) => { newValue !== voteValue && setVoteValue(newValue) };
         // Year handle change
        const handleYearChange = (event, newValue) => { newValue !== yearValue && setYearValue(newValue) };

    // Handle search submit
        const handleSubmitSearch = () => {
            let genresTab = '';
            const baseURL= 'https://api.themoviedb.org/3/discover/movie?';
            const apiKey = 'api_key=f29f2233f1aa782b0f0dc8d6d9493c64';
            const language = 'language=en-US';
            const voteFilter = 'vote_average.gte=';
            const voteAverage = voteValue * 2;
            const includeAdult = 'include_adult=false';
            if (genreValues && genreValues.length)
                genresTab = genreValues.map((obj) => { return obj.id }).join(',');
            const query = `${baseURL}${apiKey}&${language}&${voteFilter}${voteAverage}&${includeAdult}&with_genres=${genresTab}&page=`;
            props.pushQuery(query);
          
        };
    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            classes={{ paper: classes.drawerPaper }}
            onClose={props.sidebarClose}
        >
            <div className={classes.drawerHeader}>
                <Grid container direction="row" alignContent="flex-end" justify="space-between" alignItems={"center"}>
                    <Grid item xs={6} style={{padding: '12px'}}>
                        <Typography style={{color: 'white', fontSize: '1.5em', fontWeight: 'bold', verticalAlign: 'middle'}}>Filters</Typography>
                    </Grid>
                    <Grid item xs={6} style={{textAlign: 'right'}}>
                        <IconButton onClick={props.sidebarClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon style={{color: 'white'}} fontSize="large"/> : <ChevronRightIcon />}
                        </IconButton>
                    </Grid>
                </Grid>
            </div>
            <Divider style={{background: 'linear-gradient(90deg, #3f51b5, rgba(255,255,255,0))'}}/>
            <div className={classes.sidebarHomeContainer}>
                <Typography gutterBottom style={{color: 'white'}}>Year</Typography>
                <PrettoSlider 
                    valueLabelDisplay="auto" 
                    min={1910} max={2020} 
                    defaultValue={2019}
                    onChange={handleYearChange}
                />
                <Typography  gutterBottom style={{color: 'white'}}>Vote</Typography>
                <PrettoSlider 
                    onChange={handleVoteChange}
                    valueLabelDisplay="auto"
                    min={0} max={5} 
                    defaultValue={5}
                    step={1} 
                />
                <Typography gutterBottom style={{color: 'white'}}>Genre(s)</Typography>
                <Autocomplete
                    style={{color: 'white'}}
                    multiple
                    options={genres}
                    getOptionLabel={genres => genres.name}
                    filterSelectedOptions
                    onChange={handleGenresChange}
                    renderInput={params => (
                    <TextField
                        {...params}
                        className={classes.actorResearch}
                        variant="outlined"
                        placeholder="Add genre(s)"
                    />
                    )}
                />
                <div style={{ textAlign: 'left'}}>
                    <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                        <Grid item xs={12}>
                            <Button
                                style={{marginTop: '13px'}}
                                variant="contained"
                                size="medium"
                                onClick={handleSubmitSearch}
                                className={classes.buttonSearch}
                            >
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </Drawer>
    )
}

export default SidebarHome;