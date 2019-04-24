import React from 'react';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ValidatedForm } from '../shared/Validation/FlexinetsValidation';
import { ButtonLoading } from '../shared/components';
import ModalForm from '../shared/ModalForm';
import { toast } from 'react-toastify';


class CreateOrderDetail extends ModalForm {
    constructor(props) {
        super(props);

        this.state = {
            modal: true,
            accounts: null
        };
    }

    async componentDidMount() {
        const response = await axios.get('api/crmaccounts');
        this.setState({ accounts: response.data });
    }


    handleChange = (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({ [event.target.name]: value });
    }


    handleSubmit = async (event) => {
        this.setState({ loading: true });
        console.debug(this.state.accountId);
        const response = await axios.post('api/orders', { AccountID: this.state.accountId });
        if (response.status === 200) {
            toast.info("Order created");
            this.props.onClosed(response.data);
        }
        else {
            toast.error("Something went wrong :/");
            console.debug(response);
        }
    }


    render() {
        return (
            <Modal onClosed={this.onClosed} isOpen={this.state.modal} toggle={this.dismiss}>
                <ValidatedForm onSubmit={this.handleSubmit} >
                    <div className="modal-content">
                        <ModalHeader>Create order</ModalHeader>
                        <ModalBody>
                            <select className="form-control" name="accountId" value={this.state.accountId} required onChange={this.handleChange}>
                                <option value='' disabled>Select account...</option>
                                {this.state.accounts && this.state.accounts.map(o => <option key={o.CRMAccountID} value={o.CRMAccountID}>{o.CommonName}</option>)}
                            </select>
                        </ModalBody>
                        <ModalFooter>
                            <ButtonLoading className="btn btn-primary" loading={this.state.loading} type="submit">Create order</ButtonLoading> <button type="button" className="btn btn-default" onClick={this.dismiss}>Cancel</button>
                        </ModalFooter>
                    </div>
                </ValidatedForm>
            </Modal >
        );
    }
}

export default CreateOrderDetail;