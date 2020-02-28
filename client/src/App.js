import React, { useState } from 'react';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Forgot from './components/ForgotPassword/ForgotPassword';
import Menu from './components/Menu/Menu';
import Home from './containers/Home/Home';
import MovieCard from './containers/MovieCard/MovieCard';
import { Route, Switch, Redirect } from 'react-router-dom';

function App() {

  const [movieDetails, setMovieDetails] = useState(null);

  return (
    <div>
      <Route component={Menu} />
      <Switch>
        <Route exact path="/movie/:movieId" component={(props) => {return <MovieCard {...props} movieDetails={movieDetails}/>}}/>
        <Route exact path="/" component={() => <Home setMovieDetails={setMovieDetails}/>} />
        <Route exact path="/login" component={Login}/>
        <Route exact path="/signup" component={Signup}/>
        <Route exact path="/forgot" component={Forgot}/>
        <Redirect from="*" to=""/>
      </Switch>
    </div>
  );
}

export default App;
