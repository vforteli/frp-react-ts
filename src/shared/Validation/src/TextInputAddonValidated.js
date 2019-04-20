import React from 'react';
import ValidatedInput from './ValidatedInput';
import { withValidation } from './FormValidationContext';
import ValidationFeedback from './ValidationFeedback';

// todo quick fix... clean up this mess and kill this and refactor all of this into better reusable components
class TextInputAddonValidated extends ValidatedInput {
    render() {
        const { children, customValidators, isFormTouched, addonText, onChange, ...rest } = this.props;
        return (
            <div className={this.props.required ? 'form-group required' : 'form-group'}>
                <label htmlFor={this.props.name}>{this.props.label} {!this.props.required && <small>(Optional)</small>}</label>
                <div role="group" className="input-group">
                    <input onBlur={this.checkValidity} className={this.state.hasError ? 'form-control is-invalid' : 'form-control'} {...rest} onChange={this.handleChange} ref={this.inputRef} />
                    <div className="input-group-append">
                        <span className="input-group-text" id="basic-addon2">@{this.props.addonText}</span>
                    </div>
                    <ValidationFeedback validity={this.state.validity} errorMessages={this.state.errorMessages} />
                </div>                
                {this.props.children}
            </div>
        );
    }
}

export default withValidation(TextInputAddonValidated);
