import React, { Component } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import AuthenticationService from './AuthenticationService';

/*
export const PrivateRoute =
    ({ component: Component, ...rest }) => <Route {...rest} render={(props) => AuthenticationService.isLoggedIn() ?
        <Component {...props} /> :
        <Redirect to={{ pathname: '/login', state: { previousLocation: props.location } }} />} />;
*/

class PrivateRoute extends Component<RouteProps, {}> {
    render() {
        const { children, ...rest } = this.props;
        return (
            <Route {...rest} render={() =>
                AuthenticationService.isLoggedIn()
                    ? children
                    : <Redirect to={{ pathname: '/login', state: { previousLocation: this.props.location } }} />}>
            </Route>
        );
    }
}

export { PrivateRoute };
