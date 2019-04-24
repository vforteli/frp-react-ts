import axios from 'axios';
import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AccountList from './Accounts/AccountList';
import Home from './home/Home';
import NetworkList from './Networks/NetworkList';
import OrdersList from './Orders/OrderList';
import AuthenticationService from './shared/AuthenticationService';
import Login from './shared/Login';
import Menu from './shared/Menu';
import { PrivateRoute } from './shared/PrivateRoute';

class App extends Component {
  componentWillMount() {
    axios.defaults.validateStatus = (status) => status >= 200 && status < 500;
    axios.defaults.baseURL = 'http://localhost:53848';
    axios.interceptors.request.use(async (config) => AuthenticationService.authInterceptor(config));
  }

  render() {
    return (
      <Router>
        <Fragment>
          <div className='modal-blur'>
            <Menu />
            <div className='site-content'>
              <PrivateRoute exact path='/'><Home /></PrivateRoute>
              <PrivateRoute path='/orders'><OrdersList /></PrivateRoute>
              <PrivateRoute path='/accounts'><AccountList /></PrivateRoute>
              <PrivateRoute path='/mbb/networks'><NetworkList /></PrivateRoute>
              <Route path='/login' component={Login} />
            </div>
          </div>
          {/*<ToastContainer />*/}
        </Fragment>
      </Router>
    );
  }
}

export default App;
