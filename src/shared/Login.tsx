import React, { Component, FormEvent, SyntheticEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link, Route, withRouter } from 'react-router-dom';
import { Alert } from 'reactstrap';
import AuthenticationService from './AuthenticationService';
import BeginPasswordReset from './beginPasswordReset';
import { ButtonLoading } from './components';


interface IState {
    username: string;
    password: string;
    alertVisible: boolean;
    alertText: string;
    loading: boolean;
}

class Login extends Component<RouteComponentProps, IState> {
    readonly state: IState = {
        username: '',
        password: '',
        alertVisible: false,
        alertText: '',
        loading: false,
    };

    componentDidMount() {
        if (AuthenticationService.isLoggedIn()) {
            this.props.history.push('/');
        }
    }

    handleChange = (event: FormEvent<HTMLInputElement>) => {
        const target = event.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [target.name]: value } as Pick<IState, any>);
    }

    handleLogin = async (event: SyntheticEvent) => {
        event.preventDefault();
        this.setState({ loading: true });
        const response = await AuthenticationService.login(this.state.username, this.state.password);
        this.setState({ loading: false });
        if (response.status === 200) {
            if (this.props.location && this.props.location.state && this.props.location.state.previousLocation && this.props.location.state.previousLocation.pathname) {
                this.props.history.push(this.props.location.state.previousLocation.pathname);
            } else {
                this.props.history.push('/');
            }
        } else {
            this.setState({ alertVisible: true, alertText: response.data.error });
        }

    }


    onAlertDismiss = () => { this.setState({ alertVisible: false }); };


    onClosed = (event: SyntheticEvent) => {
        // sup
    }

    render() {
        return (
            <div className='col-md-6 offset-md-3'>
                <div className='card mt-3'>
                    <div className='card-body'>
                        <form method='post' onSubmit={this.handleLogin} className='form-signin'>
                            <h3>Log in to ¡FRP!</h3>

                            <Alert color='warning' isOpen={this.state.alertVisible} toggle={this.onAlertDismiss}>{this.state.alertText}</Alert>

                            <label className='sr-only' htmlFor='Username'>Email address</label>
                            <input type='email' value={this.state.username} onChange={this.handleChange} id='Username' name='username' placeholder='Email address' required autoFocus className='form-control' />
                            <label className='sr-only' htmlFor='Password'>Password</label>
                            <input type='password' value={this.state.password} onChange={this.handleChange} id='Password' name='password' placeholder='Password' required className='form-control' />

                            <ButtonLoading type='submit' loading={this.state.loading} className='btn btn-block btn-primary mt-4 mb-4'>Log in</ButtonLoading>

                            <div className='text-center'><h5><Link to='/login/reset'>Forgot password?</Link></h5></div>
                        </form>
                    </div>
                </div>
                <Route path='/login/reset' render={(props) => <BeginPasswordReset {...props} onClosed={this.onClosed} />} />
            </div >
        );
    }
}

export default withRouter(Login);
