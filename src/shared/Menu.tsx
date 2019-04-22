import React, { Component, Fragment, SyntheticEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, UncontrolledDropdown } from 'reactstrap';
import Account from '../account/Account';
import ChangePassword from '../account/ChangePassword';
import AuthenticationService from './AuthenticationService';

interface IState {
    navbarOpen: boolean;
    accountModalOpen: boolean;
    passwordModalOpen: boolean;
}

class Menu extends Component<RouteComponentProps, IState> {
    readonly state: IState = {
        accountModalOpen: false,
        navbarOpen: false,
        passwordModalOpen: false,
    };

    readonly handleLogout = async (event: SyntheticEvent) => {
        event.preventDefault();
        await AuthenticationService.logout();
        this.props.history.push('/login');
    }


    render() {
        return (
            <Fragment>
                <Navbar className='navbar fixed-top navbar-expand-md navbar-light navbar-bg-flexinets'>
                    <NavbarBrand tag={Link} to={'/'}>¡FRP!</NavbarBrand>
                    {AuthenticationService.isLoggedIn() &&
                        <Fragment>
                            <NavbarToggler onClick={() => this.setState({ navbarOpen: !this.state.navbarOpen })} />
                            <Collapse isOpen={this.state.navbarOpen} navbar>
                                <Nav className='mr-auto' navbar>
                                    <NavItem><NavLink to='/users' activeClassName='menuactive' className='nav-link'>Users</NavLink></NavItem>
                                    <NavItem><NavLink to='/mbb/networks' activeClassName='menuactive' className='nav-link'>Networks</NavLink></NavItem>
                                    <NavItem><NavLink to='/accounts' activeClassName='menuactive' className='nav-link'>Accounts</NavLink></NavItem>
                                    <NavItem><NavLink to='/orders' activeClassName='menuactive' className='nav-link'>Orders</NavLink></NavItem>
                                </Nav>
                                <Nav navbar>
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>{AuthenticationService.getCurrentUser()!.emailAddress}</DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem tag='a' href='' onClick={(e) => { e.preventDefault(); this.setState({ accountModalOpen: true }); }}><i className='fas fa-user'></i> My Account</DropdownItem>
                                            <DropdownItem tag='a' href='' onClick={(e) => { e.preventDefault(); this.setState({ passwordModalOpen: true }); }}><i className='fas fa-key'></i> Change Password</DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem tag='a' href='#logout' onClick={this.handleLogout}><i className='fas fa-sign-out-alt'></i> Log off</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </Nav>
                            </Collapse>
                        </Fragment>
                    }
                </Navbar>
                {this.state.accountModalOpen && <Account onClosed={() => this.setState({ accountModalOpen: false })} />}
                {this.state.passwordModalOpen && <ChangePassword onClosed={() => this.setState({ passwordModalOpen: false })} />}
            </Fragment>
        );
    }
}

export default withRouter(Menu);
