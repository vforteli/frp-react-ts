import React, { Component, Fragment } from 'react';

export default class CustomerTypeIcon extends Component<{ customerType: string }, {}> {
    render() {
        return (
            <Fragment>
                {this.props.customerType === 'Private' && <i className='fas fa-user'></i>}
                {this.props.customerType === 'Paper' && <i className='fas fa-envelope-square'></i>}
                {this.props.customerType === 'EInvoice' && <i className='fab fa-cloudversify'></i>}
            </Fragment>
        );
    }
}
