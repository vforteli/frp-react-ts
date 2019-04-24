import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Route, Link } from 'react-router-dom';
import moment from 'moment';
import DeleteOrderModal from './DeleteOrderModal';
import OrderDetail from './OrderDetail';
import CreateOrderDetail from './CreateOrderDetail';
import CustomerTypeIcon from './CustomerTypeIcon';
import * as signalr from '@aspnet/signalr';
import AuthenticationService from '../shared/AuthenticationService'
import { CustomInput } from 'reactstrap';
import PaginationControl from '../shared/PaginationControl';
import { TableLoading } from '../shared/components';

class OrdersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: null,
            selectedOrders: new Set(),
            count: 0,
            pageSize: 50,
            currentPage: 1,
            isDeleteModalOpen: false,
            orderHubConnected: false
        };

        console.debug(this.props.location.search);
    }

    async componentDidMount() {
        const response = await axios.get('/api/orders');
        this.setState({
            orders: response.data.Orders,
            count: response.data.Count,
            selectedOrders: new Set()
        });

        // todo refactor setup of hub connection?
        const accessToken = await AuthenticationService.getRefreshedAccessToken();
        this.orderHubConnection = new signalr.HubConnectionBuilder()
            .withUrl(`http://localhost:53848/hubs/ordershub?access_token=${accessToken}`)   // todo refactor url
            .build();

        this.orderHubConnection.on('orderDeleted', (orderId) => {
            console.debug(`Order ${orderId} was deleted`);
            this.setState({ orders: this.state.orders.filter(o => o.invoice_id !== orderId) });
        });

        this.orderHubConnection.on('reloadOrders', () => {
            console.debug('reload orders');
        });

        this.orderHubConnection.on('update', (message) => {
            console.debug(message);
        });

        this.orderHubConnection.on('updateprogress', (progress) => {
            console.debug('progress', progress);
        });

        this.orderHubConnection.on('running', (isrunning) => {
            console.debug('isrunning', isrunning);
        });

        this.orderHubConnection.start().then(result => {
            this.setState({ orderHubConnected: true });
        }).catch(err => console.error(err.toString()));
    }


    async componentWillUnmount() {
        await this.orderHubConnection.stop();
    }


    pageChanged = (page) => {
        this.setState({ currentPage: page });
    }


    confirmDeleteOrder = (order) => {
        this.setState({ isDeleteModalOpen: true, deleteOrder: order });
    }


    onClosed = async (result) => {
        if (result) {
            const response = await axios.get('/api/orders/');
            this.setState({ users: response.data });
        }
        this.props.history.push('/orders');
    }


    onCreateClosed = async (result) => {
        if (result) {
            const response = await axios.get('/api/orders/');
            this.setState({ orders: response.data.Orders });
            this.props.history.push(`/orders/edit/${result}`);
        }
        else {
            this.props.history.push('/orders');
        }
    }


    onDeleteOrderModalClosed = (result) => {
        this.setState({ isDeleteModalOpen: false, deleteOrder: null });
        if (result) {
            this.setState({ orders: this.state.orders.filter(o => o.invoice_id !== result) });
        }
    }


    toggleOrder = (event) => {
        const orderId = parseInt(event.target.id, 10);
        const selectedOrders = this.state.selectedOrders;
        if (event.target.checked) {
            selectedOrders.add(orderId);
        }
        else {
            selectedOrders.delete(orderId);
        }
        this.setState({ selectedOrders: selectedOrders });
    }


    toggleAll = (event) => {
        const checked = event.target.checked;
        console.debug('toggleAll called', checked);
        if (checked) {
            this.setState({ selectedOrders: new Set(this.state.orders.map(o => o.invoice_id)) });
        }
        else {
            this.setState({ selectedOrders: new Set() });
        }
    }


    sendToAccounting = (event) => {
        console.debug('send to accounting');
        // todo open log modal
        this.orderHubConnection.invoke('invoiceOrders', [...this.state.selectedOrders]);
        // reload orders when complete        
    }


    sendToDanfoss = (event) => {
        console.debug('send to danfoss');
        // todo open log modal
        this.orderHubConnection.invoke('sendtoDanfoss', [...this.state.selectedOrders]);
        // reload orders when complete    
    }



    render() {
        return (
            <div className="container">
                {this.state.isDeleteModalOpen && <DeleteOrderModal onClosed={this.onDeleteOrderModalClosed} deleteOrder={this.state.deleteOrder} />}

                <h3>Orders</h3>

                <div className="card mb-3">
                    <div className="card-body">
                        <Link to='/orders/create' className="btn btn-primary"><i className="fas fa-plus" /> New order</Link>{' '}
                        <button className="btn btn-info" disabled={!this.state.orderHubConnected || this.state.selectedOrders.size === 0} onClick={this.sendToAccounting}><i className="fas fa-cloud-upload-alt"></i> Send to Accounting</button>{' '}
                        <button className="btn btn-info" disabled={!this.state.orderHubConnected || this.state.selectedOrders.size === 0} onClick={this.sendToDanfoss}><i className="fas fa-cloud-upload-alt"></i> Send to Danfoss</button>{' '}
                        [<strong>{this.state.selectedOrders.size}</strong> selected]

                        <TableLoading loading={this.state.orders === null}>Getting orders</TableLoading>

                        {this.state.orders && this.state.orders.length > 0 &&
                            <Fragment>
                                <table className="table table-hover users-table">
                                    <thead>
                                        <tr className="d-none d-md-table-row">
                                            <td className="wrapcolumn"><CustomInput type="checkbox" id="toggleAll" onChange={this.toggleAll} /></td>
                                            <td>#</td>
                                            <td>Type</td>
                                            <td>Name</td>
                                            <td>Created</td>
                                            <td>Sent</td>
                                            <td>Sum</td>
                                            <td className="wrapcolumn"></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.orders.map(order =>
                                            <tr key={order.invoice_id}>
                                                <td className="wrapcolumn"><CustomInput type="checkbox" checked={this.state.selectedOrders.has(order.invoice_id) || false} onChange={this.toggleOrder} id={order.invoice_id} /></td>
                                                <td>{order.status === 0 && <i className={order.hold ? 'fas fa-pause text-warning' : 'fas fa-check text-success'}></i>}</td>
                                                <td><CustomerTypeIcon customerType={order.CustomerType} /></td>
                                                <td><Link to={'/orders/edit/' + order.invoice_id}>{order.address_name}</Link></td>
                                                <td>{moment(order.date_created).format('DD MMMM YYYY')}</td>
                                                <td>{order.date_invoiced && moment(order.date_invoiced).format('DD MMMM YYYY')}</td>
                                                <td className="no-wrap">{order.TotalsumExcludingVAT} {order.CurrencyName}</td>
                                                <td><a href="" onClick={(e) => { e.preventDefault(); this.confirmDeleteOrder(order); }}><i className="fas fa-times"></i></a></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <PaginationControl totalCount={this.state.count} pageSize={this.state.pageSize} currentPage={this.state.currentPage} pageChanged={this.pageChanged} />
                            </Fragment>
                        }
                    </div>
                </div>


                <Route path="/orders/create" render={props => <CreateOrderDetail {...props} onClosed={this.onCreateClosed} />} />
                <Route path="/orders/edit/:orderid" render={props => <OrderDetail {...props} onClosed={this.onClosed} />} />
            </div>
        );
    }
}


export default OrdersList;