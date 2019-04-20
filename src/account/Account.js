import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { TextInputValidated, ValidatedForm, ButtonLoading } from '../shared/Validation/FlexinetsValidation';
import axios from 'axios';
import AuthenticationService from '../shared/AuthenticationService';
import { toast } from 'react-toastify';
import ModalForm from '../shared/ModalForm';


class Account extends ModalForm {
    state = {
        modal: true,
        email: '',
        phonenumber: '',
        fullname: ''
    };

    componentDidMount() {
        axios.get(AuthenticationService.getAccountUrl()).then(response => {
            this.setState({
                email: response.data.EmailAddress,
                phonenumber: response.data.Phonenumber,
                fullname: response.data.Fullname
            });
        });
    }


    handleChange = event => this.setState({ [event.target.name]: event.target.value });


    handleSubmit = async (event) => {
        this.setState({ loading: true });
        const response = await axios.post(AuthenticationService.getAccountUrl(), {
            emailaddress: this.state.email,
            phonenumber: this.state.phonenumber,
            fullname: this.state.fullname
        });
        this.setState({ loading: false });
        if (response.status === 200) {
            toast.success('Your account was saved');
            this.close(this.state.userId);
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
                        <ModalHeader>My account</ModalHeader>
                        <ModalBody>
                            <TextInputValidated type="email" name="email" label="Email" required value={this.state.email} onChange={this.handleChange} placeholder="email@example.com" />
                            <TextInputValidated type="tel" name="phonenumber" label="Phone number" value={this.state.phonenumber} onChange={this.handleChange} placeholder="Phone number with country code" />
                            <TextInputValidated type="text" name="fullname" label="Name" required value={this.state.fullname} onChange={this.handleChange} placeholder="Firstname Lastname" />
                        </ModalBody>
                        <ModalFooter>
                            <ButtonLoading className="btn btn-primary" loading={this.state.loading} type="submit">Save changes</ButtonLoading> <button type="button" className="btn btn-default" onClick={this.dismiss}>Cancel</button>
                        </ModalFooter>
                    </div>
                </ValidatedForm>
            </Modal >
        );
    }
}

export default Account;