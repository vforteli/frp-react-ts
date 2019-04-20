import React from 'react';
import { FormValidationContext } from './FormValidationContext';

class ValidatedForm extends React.Component {
    state = { touched: false };
    
    handleSubmit = (event) => {
        this.setState({ touched: true });
        event.preventDefault();

        // todo this should also trigger custom validators
        // todo async validators?
        const valid = event.target.checkValidity();
        console.debug(`form isValid: ${valid}`);
        if (valid) {
            console.debug('form is valid, call parent onSubmit');
            this.props.onSubmit(event);
        }
    }

    render() {
        const { onSubmit, onTouched, ...rest } = this.props;
        return (
            <FormValidationContext.Provider value={this.state.touched}>
                <form {...rest} onSubmit={this.handleSubmit} noValidate>
                    {this.props.children}
                </form>
            </FormValidationContext.Provider>
        );
    }
}

export default ValidatedForm;