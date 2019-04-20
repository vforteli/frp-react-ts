import React from 'react';
import ValidatedInput from './ValidatedInput';
import { withValidation } from './FormValidationContext';
import ValidationFeedback from './ValidationFeedback';

class TextInputValidated extends ValidatedInput {
    render() {
        const { children, customValidators, isFormTouched, onChange, ...rest } = this.props;
        return (
            <div className={this.props.required ? 'form-group required' : 'form-group'}>
                <label htmlFor={this.props.name}>{this.props.label} {!this.props.required && <small>(Optional)</small>}</label>
                <input onBlur={this.checkValidity} className={this.state.hasError ? 'form-control is-invalid' : 'form-control'} {...rest} onChange={this.handleChange} ref={this.inputRef} />
                <ValidationFeedback validity={this.state.validity} errorMessages={this.state.errorMessages} />   
                {this.props.children}
            </div>
        );
    }
}

export default withValidation(TextInputValidated);
