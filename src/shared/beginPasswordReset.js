import React, { Component } from 'react';
import { ButtonLoading } from '../Shared/components';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AuthenticationService from './AuthenticationService';
import { ValidatedForm, TextInputValidated } from './Validation/FlexinetsValidation';



class BeginPasswordReset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailaddress: '',
            modal: true
        };
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    handleSubmit = async (event) => {
        this.setState({ loading: true });
        await AuthenticationService.beginReset(this.state.emailaddress, "urlgoeshere");
        this.setState({ loading: false });
        this.dismiss();
    }

    dismiss = (event) => { this.setState({ modal: false }); }

    onClosed = (event) => {
        this.props.onClosed("wiih");
        this.props.history.push('/login');
    }    // todo push parent?

    render() {
        return (
            <Modal onClosed={this.onClosed} isOpen={this.state.modal} toggle={this.dismiss} className={this.props.className}>
                <ValidatedForm onSubmit={this.handleSubmit}>
                    <div className="modal-content">
                        <ModalHeader>Reset password</ModalHeader>
                        <ModalBody>
                            <p>
                                Enter your email address below and click Reset password.<br />
                                You will shortly receive an email containing a link to reset your password.
                            </p>
                            <TextInputValidated type="email" label='Email' required name="emailaddress" value={this.state.emailaddress} onChange={this.handleChange} placeholder="email@example.com" />
                        </ModalBody>
                        <ModalFooter>
                            <ButtonLoading className="btn btn-primary" loading={this.state.loading} type="submit">Send reset email</ButtonLoading> <button type="button" className="btn btn-default" onClick={this.dismiss}>Cancel</button>
                        </ModalFooter>
                    </div>
                </ValidatedForm>
            </Modal>
        );
    }
}

export default BeginPasswordReset;