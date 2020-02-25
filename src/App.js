import React from 'react';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Menu from './components/Menu/Menu';
import { Route, Switch, Redirect } from 'react-router-dom';
import withAuth from './utils/withAuth';

function App() {
  return (
    <div>
      <Menu />
      <Switch>
        <Route
          exact
          path="/"
          component={withAuth()}
        />
        <Route exact path="/login" component={Login}/>
        <Route exact path="/signup" component={Signup}/>
        <Redirect from="*" to=""/>
      </Switch>
    </div>
  );
}

export default App;
