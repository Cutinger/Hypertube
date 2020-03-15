import React, {forwardRef, useEffect, useImperativeHandle} from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Logo from './../../assets/img/hypairtube-logov2-mini.png'
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import MoreIcon from '@material-ui/icons/MoreVert';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import API from '../../utils/API';
import Cookies from 'universal-cookie';
import IcomoonReact from "icomoon-react";
import iconSet from './../Icon/selection-languages.json';
const cookies = new Cookies();


const useStyles = makeStyles(theme => ({
  grow: {
    '& .MuiAppBar-colorPrimary': {
        background: 'linear-gradient(-317deg, rgba(32, 122, 244, 0.5) -25%, #0b1123, #0b1123 70%, rgba(240, 38, 120, 1) 160% ) !important',
        boxShadow: '1px 4px 29px rgba(0,0,0,0.2) !important'
    },
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  mobileDotContainer: {
    '& .MuiPaper-rounded': {
        color: 'white',
        background: 'linear-gradient(-317deg, rgba(32, 122, 244, 0.5) -25%, #0b1123, #0b1123 70%, rgba(240, 38, 120, 1) 160% ) !important',
    },
  },
  logo:{
      height: '50px',
      marginRight: '30px',
  },
}));

const key = 'f29f2233f1aa782b0f0dc8d6d9493c64';
const PrimarySearchAppBar = (forwardRef((props, ref) => {
    const classes = useStyles();
    const [searchValue, setSearchValue] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isConnected, setConnected] = React.useState(false);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [anchorElLanguage, setAnchorElLanguage] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isLanguagePopover = Boolean(anchorElLanguage);
    const [language, setLanguage] = React.useState('us');

    const translate = {
        fr: {
            Connect: 'Connexion',
            Language: 'Langue',
            WhatsHot: "Top films",
            MoviesList: 'Ma liste',
            Profile: 'Profil',
            SearchMovies: 'Rechercher un film...'

        },
        us: {
            Connect: 'Connect',
            Language: 'Language',
            WhatsHot: "What's hot",
            MoviesList: 'Movies list',
            Profile: 'Profile',
            SearchMovies: 'Search movies...'
        }
    }

    // Badge counter for list icon
    const [counterList, setCounterList] = React.useState(0);

    const handleLogout = () => {
        API.logout()
            .then(res => {
                if (res.status === 200)
                    props.history.push('/login');
            });
        handleMenuClose();
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13 && searchValue) {
            if (props.history.location.pathname !== '/') {
                e.preventDefault();
                props.history.push('/');
            }
            const lg = language === 'us' ? 'language=en-US' : 'language=fr';
            props.search(`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${searchValue}&${lg}&page=`, searchValue);
            setSearchValue('');
        }
    };

    useEffect(() => {
        const cookies = new Cookies();
        const getLg = cookies.get('lg');
        if (getLg && getLg !== language) {
            setLanguage(getLg);
        }
    },[language] );

    useEffect(() => {
        let _mounted = false;
        async function getWatchlist() {
            API.getWatchlist()
                .then(res => {
                    if (res.status === 200 && res.data.watchlist) {
                        !_mounted && setCounterList(res.data.watchlist.length);
                        !_mounted && setConnected(true);
                        !_mounted && props.setWatchlist(res.data.watchlist)
                    }
                })
        }

        if (cookies.get('token') && !isConnected) {
            getWatchlist()
        }
        return (() => _mounted = true)
    }, [props, isConnected]);

    const handleMobileMenuOpen = event => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const handleLanguageMenuOpen = event => { setAnchorElLanguage(event.currentTarget) };
    const handleLanguageMenuClose = event => {
        language === 'fr' ? setLanguage('us') : setLanguage('fr');
        props.setLanguage(language === 'fr' ? 'us' : 'fr');
        setAnchorElLanguage(null)
    };
    const handleProfileMenuOpen = event => { setAnchorEl(event.currentTarget) };
    const handleMobileMenuClose = () => { setMobileMoreAnchorEl(null) };
    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };


    // Ref accessible by App.js
    useImperativeHandle(ref, () => ({
        setLanguageHandle(language) {
            setLanguage(language);
        }
    }));

    function sectionDesktop(){
        if (isConnected)
            return (
                <div className={classes.sectionDesktop}>
                    <IconButton
                        edge="start"
                        aria-label="Language"
                        aria-controls={menuLanguage}
                        aria-haspopup="true"
                        onClick={handleLanguageMenuOpen}
                        color="inherit"
                    >
                        <IcomoonReact iconSet={iconSet} size={24} icon={language} />
                    </IconButton>
                    <IconButton aria-label="show 17 new notifications" color="inherit">
                        <Badge badgeContent={'+'} color="secondary">
                            <WhatshotIcon onClick={(e) => {
                                e.preventDefault();
                                props.history.push('/')
                            }}/>
                        </Badge>
                    </IconButton>
                    <IconButton aria-label="show 17 new notifications" color="inherit">
                        <Badge badgeContent={counterList} color="secondary">
                            <SubscriptionsIcon onClick={(e) => {
                                e.preventDefault();
                                props.history.push('/historic')
                            }}/>
                        </Badge>
                    </IconButton>
                    <IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <AccountCircle/>
                    </IconButton>
                </div>
             )
        else
            return (
                <div className={classes.sectionDesktop}>
                    <IconButton
                        edge="start"
                        aria-label="Language"
                        aria-controls={menuLanguage}
                        aria-haspopup="true"
                        onClick={handleLanguageMenuOpen}
                        color="inherit"
                    >
                        <IcomoonReact iconSet={iconSet} size={24} icon={language} />
                    </IconButton>
                    <IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <AccountCircle/>
                    </IconButton>
                </div>
            )
}
    // Mobile
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = () => {
        return (
            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                id={mobileMenuId}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMobileMenuOpen}
                onClose={handleMobileMenuClose}
                className={classes.mobileDotContainer}
            >
                {!isConnected ?
                    <div>
                        <MenuItem onClick={handleProfileMenuOpen}>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="primary-search-account-menu"
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <p>{translate[language]['Connect']}</p>
                        </MenuItem>
                        <MenuItem onClick={handleLanguageMenuOpen}>
                            <IconButton color="inherit" >
                                <IcomoonReact iconSet={iconSet} size={24} icon={language} />
                            </IconButton>
                            <p>Language</p>
                        </MenuItem>
                    </div>
                    :
                    <div>
                        <MenuItem>
                            <IconButton aria-label="show 11 new notifications" color="inherit">
                                <Badge badgeContent={'20+'} color="secondary">
                                    <WhatshotIcon onClick={(e) => {
                                        e.preventDefault();
                                        props.history.push('/historic')
                                    }}/>
                                </Badge>
                            </IconButton>
                            <p>{translate[language]['WhatsHot']}</p>
                        </MenuItem>
                        <MenuItem onClick={(e) => {
                            e.preventDefault();
                            props.history.push('/historic')
                        }}>
                            <IconButton aria-label="show 11 new notifications" color="inherit">
                                <Badge badgeContent={counterList} color="secondary">
                                    <SubscriptionsIcon />
                                </Badge>
                            </IconButton>
                            <p>{translate[language]['MoviesList']}</p>
                        </MenuItem>
                        <MenuItem onClick={handleProfileMenuOpen}>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="primary-search-account-menu"
                                aria-haspopup="true"
                                color="inherit"
                                >
                                <AccountCircle />
                            </IconButton>
                            <p>{translate[language]['Profile']}</p>
                        </MenuItem>
                        <MenuItem onClick={handleLanguageMenuOpen}>
                            <IconButton
                                color="inherit"
                                onClick={handleLanguageMenuOpen}
                            >
                                <IcomoonReact iconSet={iconSet} size={24} icon={language} />
                            </IconButton>
                            <p>{translate[language]['Language']}</p>
                        </MenuItem>
                    </div>}
            </Menu>)
    };

    // Popovers
    const menuId = 'primary-search-account-menu';
    const menuLanguage = 'primary-select-language-menu';
    const renderMenuLanguage = (
        <Menu
            anchorEl={anchorElLanguage}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuLanguage}
            keepMounted
            style={{zIndex: '2000'}}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isLanguagePopover}
            onClose={() => setAnchorElLanguage(null)}
        >
            <MenuItem onClick={handleLanguageMenuClose}>
                <IcomoonReact iconSet={iconSet} size={24} icon={language === 'fr' ? 'us' : 'fr'} />
            </MenuItem>
        </Menu>
    );
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={(e) => { handleMenuClose(); e.preventDefault(); props.history.push('/profile')} } >Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </Menu>
    );
    const renderMenuOffline = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={(e) => { e.preventDefault(); props.history.push('/login')} }>Log in</MenuItem>
            <MenuItem onClick={(e) => { e.preventDefault(); props.history.push('/signup')} }>Sign up</MenuItem>
        </Menu>
    );

    return (
        <div className={classes.grow}>
            <AppBar style={{boxShadow: 'none'}} position="fixed">
                <Toolbar>
                    {isConnected ? <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => { props.setSidebar(true) }}
                    >
                        <MenuIcon />
                    </IconButton> : null }
                <img 
                    src={Logo}
                    onClick={(e) => { e.preventDefault(); props.history.push('/') }}
                    alt='Hypeertube'
                    className={classes.logo}
                />
                {isConnected ? <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                        placeholder={translate[language]['SearchMovies']}
                        classes={{root: classes.inputRoot, input: classes.inputInput }}
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div> : null }
                <div className={classes.grow} />
                    {sectionDesktop()}
                <div className={classes.sectionMobile}>
                    <IconButton
                        aria-label="show more"
                        aria-controls={mobileMenuId}
                        aria-haspopup="true"
                        onClick={handleMobileMenuOpen}
                        color="inherit"
                    >
                    <MoreIcon />
                    </IconButton>
                </div>
                </Toolbar>
            </AppBar>
            {renderMenuLanguage}
            {renderMobileMenu()}
            {isConnected ? renderMenu : renderMenuOffline}
        </div>
        );
}));
export default PrimarySearchAppBar;