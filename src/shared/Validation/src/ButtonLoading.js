import React from 'react';

const ButtonLoading = props => {
    const { loading: Loading, ...rest } = props;
    return <button {...rest} disabled={Loading}> {Loading && <span><i className="fas fa-circle-notch fa-spin" /></span>} {props.children}</button>;
};

export default ButtonLoading;