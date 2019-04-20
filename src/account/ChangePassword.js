import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { TextInputValidated, ValidatedForm, ButtonLoading } from '../shared/Validation/FlexinetsValidation';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthenticationService from '../shared/AuthenticationService';
import ModalForm from '../shared/ModalForm';


class ChangePassword extends ModalForm {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            oldpassword: '',
            password: '',
            passwordconfirm: ''
        };
    }


    handleChange = event => this.setState({ [event.target.name]: event.target.value });


    handleSubmit = async (event) => {
        this.setState({ loading: true });

        const response = await axios.post(AuthenticationService.getAccountUrl() + 'changepassword/', {
            oldpassword: this.state.oldpassword,
            password: this.state.password,
            passwordconfirm: this.state.passwordconfirm
        });

        this.setState({ loading: false });
        if (response.status === 200) {
            toast.success('Your password has been changed');
            this.close();
        }
        else {
            toast.error(`Something went wrong: ${response.statusText}`);
            console.debug(response);
        }
    }


    render() {
        return (
            <Modal onClosed={this.onClosed} isOpen={this.state.modal} toggle={this.dismiss}>
                <ValidatedForm onSubmit={this.handleSubmit}>
                    <div className="modal-content">
                        <ModalHeader>Change password</ModalHeader>
                        <ModalBody>
                            <TextInputValidated type="password" name="oldpassword" label="Name" required value={this.state.oldpassword} onChange={this.handleChange} placeholder="Old password" />
                            <TextInputValidated type="password" name="password" label="New password" required value={this.state.password} onChange={this.handleChange} placeholder="New password" />
                            <TextInputValidated type="password" name="passwordconfirm" label="Confirm password" required value={this.state.passwordconfirm} onChange={this.handleChange} placeholder="Confirm password" />
                        </ModalBody>
                        <ModalFooter>
                            <ButtonLoading className="btn btn-primary" loading={this.state.loading} type="submit">Change password</ButtonLoading> <button type="button" className="btn btn-default" onClick={this.dismiss}>Cancel</button>
                        </ModalFooter>
                    </div>
                </ValidatedForm>
            </Modal >
        );
    }
}

export default ChangePassword;