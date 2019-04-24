import React from 'react';
import { ButtonLoading } from '../shared/components';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ValidatedForm } from '../shared/Validation/FlexinetsValidation';
import ModalForm from '../shared/ModalForm';


class DeleteOrderModal extends ModalForm {
    constructor(props) {
        super(props);
        this.state = { modal: true };
    }


    handleSubmit = async (event) => {
        this.setState({ loading: true });

        const response = await axios.delete(`api/orders/${this.props.deleteOrder.invoice_id}`);
        this.setState({ loading: false });
        if (response.status === 200) {
            toast.success('Order was deleted');
            this.dismiss(this.props.deleteOrder.invoice_id);
        }
        else {
            toast.error('Something went wrong =(');
            console.debug(response);
        }
    }


    render() {
        return (
            <Modal onClosed={this.onClosed} isOpen={this.state.modal} toggle={this.dismiss}>
                <ValidatedForm onSubmit={this.handleSubmit}>
                    <div className="modal-content">
                        <ModalBody>
                            <h5>Really delete order {this.props.deleteOrder.invoice_id}?</h5>
                            Are you sure you want to delete order for <strong>{this.props.deleteOrder.address_name}</strong>
                        </ModalBody>
                        <ModalFooter>
                            <ButtonLoading className="btn btn-danger" loading={this.state.loading} type="submit">Delete order</ButtonLoading> <button type="button" className="btn btn-default" onClick={this.dismiss}>Cancel</button>
                        </ModalFooter>
                    </div>
                </ValidatedForm>
            </Modal >
        );
    }
}

export default DeleteOrderModal;