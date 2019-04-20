import React, { Component, Fragment } from 'react';

class ButtonLoading extends Component {
    render() {
        const { loading: Loading, ...rest } = this.props;
        return (
            <button {...rest} disabled={Loading}> {Loading && <span><i className="fas fa-circle-notch fa-spin"></i></span>} {this.props.children}</button>
        );
    }
}

class TableLoading extends Component {
    render() {
        return (
            <Fragment>
                {this.props.loading &&
                    <div className="text-center">
                        <div className="chartloading"></div>
                        <h4>{this.props.children}</h4>
                    </div>}
            </Fragment>
        );
    }
}

export { ButtonLoading, TableLoading };