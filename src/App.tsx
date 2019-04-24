import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './home/Home';
import Login from './shared/Login';
import Menu from './shared/Menu';
import { PrivateRoute } from './shared/PrivateRoute';

class App extends Component {
  render() {
    return (
      <Router>
        <Fragment>
          <div className='modal-blur'>
            <Menu />
            <div className='site-content'>
              <PrivateRoute exact path='/' component={Home} />
              {/*
              <PrivateRoute path='/orders' component={OrdersList} />
              <PrivateRoute path='/accounts' component={AccountList} />
              <PrivateRoute path='/mbb/networks' component={NetworkList} />
              */}
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
