import React from 'react';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Forgot from './components/ForgotPassword/ForgotPassword';
import Menu from './components/Menu/Menu';
import Home from './containers/Home/Home';
import { Route, Switch, Redirect } from 'react-router-dom';
import withAuth from './utils/withAuth';

function App() {
  return (
    <div>
      <Route component={Menu} />
      <Switch>
        <Route exact path="/" component={withAuth(Forgot)} />
        <Route exact path="/home" component={Home}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/signup" component={Signup}/>
        <Route exact path="/forgot" component={Forgot}/>
        <Redirect from="*" to=""/>
      </Switch>
    </div>
  );
}

export default App;
