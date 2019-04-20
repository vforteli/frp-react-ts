import React, { Component } from 'react';

// todo ditch the html5 piggy backing alltogether?
class ValidatedInput extends Component {
    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
        this.state = {
            hasError: false,
            validity: {},
            errorMessages: []    // todo refactor used for server side error messages... 
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.isFormTouched && this.props.isFormTouched) {
            console.debug('form touched, set validity');
            this.setValidity(this.inputRef.current);
        }
    }

    handleChange = (e) => {
        this.props.onChange(e);
        this.checkValidity(e);
    }


    checkValidity = async (e) => this.setValidity(e.target)


    setValidity = async (target) => {
        const customErrors = [];
        if (!target.readOnly && this.props.customValidators) {
            await Promise.all(this.props.customValidators.map(async (validator) => {
                const customValidatorResult = await validator(target.value);
                console.debug(customValidatorResult);
                if (!customValidatorResult.valid) {
                    customErrors.push(customValidatorResult.message);
                }
            }));
            console.debug('Found custom errors', customErrors.length);
            target.setCustomValidity(customErrors.length > 0 ? 'errors' : ''); // not really interested in the error here but this sets the html5 validation          
        }

        // todo maybe get rid of using html5 validity        
        this.setState({
            errorMessages: customErrors,
            hasError: !target.validity.valid,
            validity: target.validity
        });
    }
}

export default ValidatedInput;