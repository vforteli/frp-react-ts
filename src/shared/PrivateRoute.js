import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthenticationService from './AuthenticationService';

export const PrivateRoute =
    ({ component: Component, ...rest }) => <Route {...rest} render={(props) => AuthenticationService.isLoggedIn() ?
        <Component {...props} /> :
        <Redirect to={{ pathname: '/login', state: { previousLocation: props.location } }} />} />;
