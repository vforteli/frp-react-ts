import React from 'react';
import AuthenticationService from './AuthenticationService';
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({ component: Component, ...rest }) => <Route {...rest} render={props => AuthenticationService.isLoggedIn() ? <Component {...props} /> : <Redirect to={{ pathname: "/login", state: { previousLocation: props.location } }} />} />;