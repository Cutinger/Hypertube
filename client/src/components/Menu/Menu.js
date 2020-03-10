import React, {useEffect} from 'react';
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
const cookies = new Cookies();

const useStyles = makeStyles(theme => ({
  grow: {
    '& .MuiAppBar-colorPrimary': {
        background: 'linear-gradient(-317deg, rgba(32, 122, 244, 0.5) -25%, #0b1123, #0b1123 70%, rgba(240, 38, 120, 1) 160% ) !important',
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

export default function PrimarySearchAppBar(props) {
    const classes = useStyles();
    const [searchValue, setSearchValue] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isConnected, setConnected] = React.useState(false);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    // Badge counter for list icon
    const [counterList, setCounterList] = React.useState(0);
    const handleProfileMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleLogout = () => {
        API.logout()
            .then(res => {
                if (res.status === 200)
                    props.history.push('/login');
            });
        handleMenuClose();
    }
    const handleMobileMenuOpen = event => {
        setMobileMoreAnchorEl(event.currentTarget);
    };



    useEffect(() => {
        let _mounted = true;
        function getWatchlist() {
            API.getWatchlist()
                .then(res => {
                    if (res.status === 200 && res.data.watchlist && res.data.watchlist.length) {
                        _mounted && setCounterList(res.data.watchlist.length);
                        _mounted && setConnected(true);
                        _mounted && props.setWatchlist(res.data.watchlist)
                    }
                })
                .catch(err => console.log(err));
        }

        if (_mounted && cookies.get('token')) {
            getWatchlist()
        }
        return (() => _mounted = false)
    }, [props]);

    const handleKeyDown = (e) => {
        if (e.keyCode === 13 && searchValue) {
            if (props.history.location.pathname !== '/') {
                e.preventDefault();
                props.history.push('/');
            }
            props.search(`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${searchValue}&page=`);
            setSearchValue('');
        }
    };

    const menuId = 'primary-search-account-menu';
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
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
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

    function sectionDesktop(){
        if (isConnected)
            return (
                <div className={classes.sectionDesktop}>
                    <IconButton aria-label="show 17 new notifications" color="inherit">
                        <Badge badgeContent={'+'} color="secondary">
                            <WhatshotIcon/>
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
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
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

            <MenuItem>
                <IconButton aria-label="show 11 new notifications" color="inherit">
                    <Badge badgeContent={'20+'} color="secondary">
                        <WhatshotIcon />
                    </Badge>
                </IconButton>
                <p>What's hot</p>
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
                <p>Movies list</p>
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
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );
    const renderMobileMenuOffline = (
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
        <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
            <p>Connect</p>
        </MenuItem>
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
                        placeholder="Search movies..."
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
            {isConnected ? renderMobileMenu : renderMobileMenuOffline}
            {isConnected ? renderMenu : renderMenuOffline}
        </div>
        );
}