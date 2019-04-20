import React from 'react';
import PropTypes from 'prop-types';

const ValidationInfoDetail = props => 
    <div className="invalid-feedback">
        {props.validity.valueMissing && 'This field is required'}
        {!props.validity.valueMissing && props.validity.typeMismatch && 'This field is invalid'}
        {props.errorMessages.map(o => <div key={o}>{o}</div>)}
    </div>;

ValidationInfoDetail.propTypes = {
    validity: PropTypes.object,
    errorMessages: PropTypes.arrayOf(PropTypes.string)
};

export default ValidationInfoDetail;