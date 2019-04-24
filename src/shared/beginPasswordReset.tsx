import React, { Component, FormEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import AuthenticationService from './AuthenticationService';
import { ButtonLoading } from './components';
import { TextInputValidated, ValidatedForm } from './Validation/FlexinetsValidation';

interface IState {
    emailAddress: string;
    modal: boolean;
    loading: boolean;
}

interface IProps {
    onClosed: (event: any) => void;
}


class BeginPasswordReset extends Component<RouteComponentProps & IProps, IState> {
    state: IState = {
        emailAddress: '',
        modal: true,
        loading: false,
    };

    handleChange = (event: FormEvent<HTMLInputElement>) => {
        console.debug('derp');
        const target = event.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [target.name]: value } as Pick<IState, any>);
    }

    handleSubmit = async () => {
        this.setState({ loading: true });
        await AuthenticationService.beginReset(this.state.emailAddress, 'urlgoeshere');
        this.setState({ loading: false });
        this.dismiss();
    }

    dismiss = () => { this.setState({ modal: false }); };

    onClosed = () => {
        this.props.onClosed('wiih');
        this.props.history.push('/login');
    }

    render() {
        return (
            <Modal onClosed={this.onClosed} isOpen={this.state.modal} toggle={this.dismiss}>
                <ValidatedForm onSubmit={this.handleSubmit}>
                    <div className='modal-content'>
                        <ModalHeader>Reset password</ModalHeader>
                        <ModalBody>
                            <p>
                                Enter your email address below and click Reset password.<br />
                                You will shortly receive an email containing a link to reset your password.
                            </p>
                            <TextInputValidated type='email' label='Email' required name='emailAddress' value={this.state.emailAddress} onChange={this.handleChange} placeholder='email@example.com' />
                        </ModalBody>
                        <ModalFooter>
                            <ButtonLoading className='btn btn-primary' loading={this.state.loading} type='submit'>Send reset email</ButtonLoading> <button type='button' className='btn btn-default' onClick={this.dismiss}>Cancel</button>
                        </ModalFooter>
                    </div>
                </ValidatedForm>
            </Modal>
        );
    }
}

export default BeginPasswordReset;
