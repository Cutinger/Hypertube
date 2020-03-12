import React from 'react';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Forgot from './components/ForgotPassword/ForgotPassword';
import Menu from './components/Menu/Menu';
import Profile from './components/Profile/Profile';
import Home from './containers/Home/Home';
import MovieCard from './containers/MovieCard/MovieCard';
import withAuth from './utils/withAuth';
import 'react-notifications-component/dist/theme.css'

import ReactNotification from 'react-notifications-component';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import {makeStyles} from "@material-ui/core/styles";

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

  // const [watchlist, setWatchlist] = useState([]);

  const homeRef = React.useRef();
  const historicRef = React.useRef();
  const history = useHistory();
  const classes = useStyles();

  const handleActiveSidebar = (bool) => {
    if (history && history.location.pathname === '/'){
      homeRef.current && homeRef.current.setSidebar(bool);
    }
  };
  const handleSetWatchlist= (watchlist) => {
      homeRef.current && homeRef.current.getWatchlist(watchlist);
      historicRef.current && historicRef.current.getWatchlist(watchlist);

  };

  const handleSearchMovie = (query, value) => {
      homeRef.current && homeRef.current.setSearch(query, value);
  };

  return (
    <div>
      <div className={classes.topBackground} />
      <Route component={(props) => <Menu {...props} search={handleSearchMovie} setWatchlist={handleSetWatchlist} setSidebar={handleActiveSidebar}/>}/>
      <div className={"notifications"}>
        <ReactNotification />
    </div>
      <Switch>
        <Route exact path="/movie/:movieId" component={
          // withAuth(
          (matchProps) => <MovieCard {...props} {...matchProps} />
          // )
        } />
        <Route exact path="/" component={
          // withAuth(
              (props) => <Home {...props} ref={homeRef} setSidebar={handleActiveSidebar} />
               // )
        } />
        <Route exact path="/historic" component={
          // withAuth(
              (props) => <Home ref={historicRef} {...props} />
          // )
        } />
        <Route exact path="/profile" component={
          // withAuth(
          (props) => <Profile {...props} />
          // )
        } />
        <Route exact path="/login" component={Login}/>
        <Route exact path="/signup" render={(props) => <Signup {...props} />}/>
        <Route exact path="/forgot" component={Forgot}/>
        <Redirect from="*" to=""/>
      </Switch>
    </div>
  );
};
