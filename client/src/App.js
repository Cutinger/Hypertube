import React from 'react';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Forgot from './components/ForgotPassword/ForgotPassword';
import Menu from './components/Menu/Menu';
import Home from './containers/Home/Home';
import MovieCard from './containers/MovieCard/MovieCard';
import withAuth from './utils/withAuth';
import 'react-notifications-component/dist/theme.css'

import ReactNotification from 'react-notifications-component';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

export default function App(props) {

  // const [watchlist, setWatchlist] = useState([]);

  const homeRef = React.useRef();
  const historicRef = React.useRef();
  const history = useHistory();

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
      <Route component={(matchProps) => <Menu {...matchProps} {...props} search={handleSearchMovie} setWatchlist={handleSetWatchlist} setSidebar={handleActiveSidebar}/>}/>
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
              (props) => <Home  history={history} {...props} ref={homeRef} setSidebar={handleActiveSidebar} />
               // )
        } />
        <Route exact path="/historic" component={
          // withAuth(
              (props) => <Home  history={history} ref={historicRef} {...props} />
          // )
        } />
        <Route exact path="/login" component={Login}/>
        <Route exact path="/signup" render={() => <Signup {...props} history={history} />}/>
        <Route exact path="/forgot" component={Forgot}/>
        <Redirect from="*" to=""/>
      </Switch>
    </div>
  );
};
