import React, { ButtonHTMLAttributes, Component } from 'react';

interface IProps {
    loading: boolean;
}

export default class ButtonLoading extends Component<IProps & ButtonHTMLAttributes<{}>, {}> {
    render() {
        const { loading: Loading, ...rest } = this.props;
        return (
            <button {...rest} disabled={Loading}> {Loading && <span><i className='fas fa-circle-notch fa-spin'></i></span>} {this.props.children}</button>
        );
    }
}
