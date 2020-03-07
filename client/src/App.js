import React, { useState} from 'react';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Forgot from './components/ForgotPassword/ForgotPassword';
import Menu from './components/Menu/Menu';
import Home from './containers/Home/Home';
import MovieCard from './containers/MovieCard/MovieCard';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

export default function App(props) {

  const [movieDetails, setMovieDetails] = useState(null);
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
        <Route exact path="/movie/:movieId" component={(matchProps) => <MovieCard {...props} {...matchProps} movieDetails={movieDetails}/>} />
        <Route exact path="/" render={() => <Home  history={history} {...props} ref={homeRef} setSidebar={handleActiveSidebar} setMovieDetails={setMovieDetails}/> } />
        <Route exact path="/login" component={Login}/>
        <Route exact path="/signup" render={() => <Signup {...props} history={history} />}/>
        <Route exact path="/forgot" component={Forgot}/>
        <Redirect from="*" to=""/>
      </Switch>
    </div>
  );
};
