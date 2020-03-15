import React, {useEffect} from 'react';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Forgot from './components/ForgotPassword/ForgotPassword';
import Menu from './components/Menu/Menu';
import Profile from './components/Profile/Profile';
import Home from './containers/Home/Home';
import MovieCard from './containers/MovieCard/MovieCard';
import withAuth from './utils/withAuth';
import 'react-notifications-component/dist/theme.css'
import ActiveAccount from './components/ActiveAccount/ActiveAccount';
import ResetPassword from './components/ResetPassword/ResetPassword';
import ReactNotification from 'react-notifications-component';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import {makeStyles} from "@material-ui/core/styles";
import Cookies from 'universal-cookie';

const useStyles = makeStyles(theme => ({
  topBackground: {
    position: 'absolute',
    top: '0',
    left: '0',
    height: '500px',
    width: '100%',
    zIndex: -1,
    background: 'linear-gradient(-180deg, #0d1c37 40%, rgba(0, 0, 0, 0) ) !important'
  }
}));

export default function App(props) {

  const homeRef = React.useRef();
  const menuRef = React.useRef();
  const signupRef = React.useRef();
  const movieRef = React.useRef();
  const loginRef = React.useRef();
  const historicRef = React.useRef();
  const profileRef = React.useRef();
  const history = useHistory();
  const classes = useStyles();
  const [language, setLanguage] = React.useState('us');

  const handleActiveSidebar = (bool) => {
    if (history && history.location.pathname === '/'){
      homeRef.current && homeRef.current.setSidebar(bool);
    }
  };
  const handleSetWatchlist = (watchlist) => {
    homeRef.current && homeRef.current.setWatchlists(watchlist);
    historicRef.current && historicRef.current.getWatchlists(watchlist);
  };


  useEffect(() => {
    const cookies = new Cookies();
    const getLg = cookies.get('lg');
    if (getLg && getLg !== language) {
      setLanguage(getLg);
    }
  },[language] );

  const handleSetLanguage = (language) => {
    if (language && typeof (language) !== 'undefined') {
      const cookies = new Cookies();
      menuRef.current && menuRef.current.setLanguageHandle(language);
      signupRef.current && signupRef.current.setLanguageHandle(language);
      loginRef.current && loginRef.current.setLanguageHandle(language);
      homeRef.current && homeRef.current.setLanguageHandle(language);
      movieRef.current && movieRef.current.setLanguageHandle(language);
      profileRef.current && profileRef.current.setLanguageHandle(language);
      cookies.set('lg', language, {path: '/'})
    }
  };
  const handleSearchMovie = (query, value) => { homeRef.current && homeRef.current.setSearch(query, value) };

  return (
    <div>
      <div className={classes.topBackground} />
      <Menu history={history} ref={menuRef} setLanguage={handleSetLanguage} search={handleSearchMovie} setWatchlists={handleSetWatchlist} setSidebar={handleActiveSidebar}/>
      <div className={"notifications"}> <ReactNotification /> </div>
      <Switch>
        <Route exact path="/movie/:movieId" component={withAuth((matchProps) => <MovieCard {...props} ref={movieRef} {...matchProps} /> )} />
        <Route exact path="/" component={withAuth((props) => <Home {...props} ref={homeRef} setSidebar={handleActiveSidebar} /> )} />
        <Route exact path="/historic" component={withAuth((props) => <Home ref={historicRef} {...props} /> )} />
        <Route exact path="/profile" component={withAuth((props) => <Profile {...props} ref={profileRef} /> )} />
        <Route exact path="/login" component={(props) => <Login {...props} ref={loginRef} />}/>
        <Route exact path="/users/reset/:token" component={(props) => <ResetPassword {...props} />}/>
        <Route exact path="/users/active/:token" component={(props) => <ActiveAccount {...props} />}/>
        <Route exact path="/signup" render={(props) => <Signup {...props} ref={signupRef} />}/>
        <Route exact path="/forgot" component={Forgot}/>
        <Redirect from="*" to=""/>
      </Switch>
    </div>
  );
};
