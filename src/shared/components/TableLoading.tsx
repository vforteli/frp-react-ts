import React, { Component, Fragment, HTMLAttributes } from 'react';

interface IProps {
    loading: boolean;
}

export default class TableLoading extends Component<IProps & HTMLAttributes<{}>> {
    render() {
        return (
            <Fragment>
                {this.props.loading &&
                    <div className='text-center'>
                        <div className='chartloading'></div>
                        <h4>{this.props.children}</h4>
                    </div>}
            </Fragment>
        );
    }
}
