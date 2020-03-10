import React from 'react';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Forgot from './components/ForgotPassword/ForgotPassword';
import Menu from './components/Menu/Menu';
import Home from './containers/Home/Home';
import MovieCard from './containers/MovieCard/MovieCard';
import withAuth from './utils/withAuth';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

export default function App(props) {

  // const [watchlist, setWatchlist] = useState([]);

  const homeRef = React.useRef();
  const history = useHistory();

  const handleActiveSidebar = (bool) => {
    if (history && history.location.pathname === '/'){
      homeRef.current && homeRef.current.setSidebar(bool);
    }
  };
  // const handleSetWatchlist= (movies) => {
  //     homeRef.current && homeRef.current.setWatchlist(movies);
  //   }

  const handleSearchMovie = (movies) => {
      homeRef.current && homeRef.current.setSearch(movies);
  }

  return (
    <div>
      <Route component={(matchProps) => <Menu {...matchProps} {...props} search={handleSearchMovie}  setSidebar={handleActiveSidebar}/>}/>
  
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
              (props) => <Home  history={history} {...props} />
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
