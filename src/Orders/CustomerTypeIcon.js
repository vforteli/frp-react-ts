import React, { Component, Fragment } from 'react';

class CustomerTypeIcon extends Component {
    render() {
        return (
            <Fragment>
                {this.props.customerType === 'Private' && <i className="fas fa-user"></i>}
                {this.props.customerType === 'Paper' && <i className="fas fa-envelope-square"></i>}
                {this.props.customerType === 'EInvoice' && <i className="fab fa-cloudversify"></i>}
            </Fragment>
        )
    }
}

export default CustomerTypeIcon;
