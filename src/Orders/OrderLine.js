import React, { Component } from 'react';

class OrderLine extends Component {

    render() {
        return (
            <tr>
                <td>{this.props.productCategories && this.props.productCategories.filter(o => o.ProductCategoryId === this.props.value.ProductCategoryId)[0].Title}</td>
                <td>{this.props.value.Title}</td>
                <td>{this.props.value.Quantity}</td>
                <td className="text-nowrap">{this.props.value.Price} {this.props.value.CurrencyName}</td>
                <td className="text-nowrap">{this.props.value.Price * this.props.value.Quantity}</td>
            </tr>
        )
    }
}

export default OrderLine;
