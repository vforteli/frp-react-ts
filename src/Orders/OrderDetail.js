import React from 'react';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { TextInputValidated, ValidatedForm, TextAreaInputValidated } from '../shared/Validation/FlexinetsValidation';
import { ButtonLoading } from '../shared/components';
import ModalForm from '../Shared/ModalForm';
import OrderLine from './OrderLine';


class OrderDetail extends ModalForm {
    constructor(props) {
        super(props);

        this.state = {
            orderId: props.match.params.orderid,
            modal: true,
            AddressName: '',
            AddressAttention: '',
            AddressReferencePerson: '',
            AddressReference: '',
            AddressStreet: '',
            AddressZip: '',
            AddressState: '',
            AddressCity: '',
            AddressCountry: '',
            OrderID: undefined,
            CurrencyId: undefined,
            Locale: '',
            Vat: '',
            TermofPayment: '',
            Notes: '',
            Number: '',
            NumberPrefix: undefined,
            Orderlines: undefined,
            currencies: null,
            productCategories: null
        };
    }

    async componentDidMount() {
        const response = await axios.get(`api/orders/${this.state.orderId}`);
        this.setState({
            AddressName: response.data.AddressName,
            AddressAttention: response.data.AddressAttention,
            AddressReferencePerson: response.data.AddressReferencePerson,
            AddressReference: response.data.AddressReference,
            AddressStreet: response.data.AddressStreet,
            AddressZip: response.data.AddressZip,
            AddressState: response.data.AddressState,
            AddressCity: response.data.AddressCity,
            AddressCountry: response.data.AddressCountry,
            OrderID: response.data.OrderID,
            CurrencyId: response.data.CurrencyId,
            Locale: response.data.Locale,
            Vat: response.data.Vat,
            TermofPayment: response.data.TermofPayment,
            Notes: response.data.Notes === null ? '' : response.data.Notes,
            Number: response.data.Number,
            NumberPrefix: response.data.NumberPrefix,
            Orderlines: response.data.Orderlines
        });

        this.setState({ currencies: (await axios.get('/Api/currency/')).data });

        this.setState({ productCategories: (await axios.get('/Api/ProductCategories/')).data });
    }




    handleChange = (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this.setState({ [event.target.name]: value });
    }


    copyToNew = async (event) => {
        const response = await axios.post(`/Api/orders/copy/${this.state.orderId}`);
        this.props.history.push(`/orders/edit/${response.data}`);   // todo fix
    }


    handleSubmit = async (event) => {
        this.setState({ loading: true });


    }


    render() {
        return (
            <Modal size='lg' onClosed={this.onClosed} isOpen={this.state.modal} toggle={this.dismiss}>
                <ValidatedForm onSubmit={this.handleSubmit} >
                    <div className="modal-content">
                        <ModalHeader>{this.state.orderId ? `Edit order ${this.state.orderId}` : 'Create order'}</ModalHeader>
                        <ModalBody>
                            <div className="row">
                                <div className="col-sm-4">
                                    <TextInputValidated type="text" name="AddressName" label="Name" required value={this.state.AddressName} onChange={this.handleChange} />
                                </div>
                                <div className="col-sm-4">
                                    <TextAreaInputValidated name="AddressStreet" label="Name" value={this.state.AddressStreet} onChange={this.handleChange} />
                                </div>
                                <div className="col-sm-4">
                                    <TextAreaInputValidated name="Notes" tabIndex="-1" label="Notes" value={this.state.Notes} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-3">
                                    <TextInputValidated type="text" name="AddressZip" label="Zip" value={this.state.AddressZip} onChange={this.handleChange} />
                                </div>
                                <div className="col-sm-3">
                                    <TextInputValidated type="text" name="AddressCity" label="City" value={this.state.AddressCity} onChange={this.handleChange} />
                                </div>
                                <div className="col-sm-3">
                                    <TextInputValidated type="text" name="AddressState" label="State" value={this.state.AddressState} onChange={this.handleChange} />
                                </div>
                                <div className="col-sm-3">
                                    <TextInputValidated type="text" name="AddressCountry" label="Country" value={this.state.AddressCountry} onChange={this.handleChange} />
                                </div>
                            </div>


                            <div className="row">
                                <div className="col-sm-4">
                                    <TextInputValidated type="text" name="AddressAttention" label="Attention" value={this.state.AddressAttention} onChange={this.handleChange} />
                                </div>
                                <div className="col-sm-4">
                                    <TextInputValidated type="text" name="AddressReferencePerson" label="Ref person" value={this.state.AddressReferencePerson} onChange={this.handleChange} />
                                </div>
                                <div className="col-sm-4">
                                    <TextInputValidated type="text" name="AddressReference" label="Reference" value={this.state.AddressReference} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-3">
                                    <div className="form-group form-group-sm">
                                        <label className="control-label">Currency</label>
                                        <select className="form-control" required value={this.state.CurrencyId}>
                                            {this.state.currencies && this.state.currencies.map(o => <option key={o.CurrencyId} value={o.CurrencyId}>{o.CurrencyName}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <div className="form-group form-group-sm">
                                        <label className="control-label">Language</label>
                                        <select ng-model="model.Locale" className="form-control" required>
                                            <option value="sv-SE">Swedish</option>
                                            <option value="fi-FI">Finnish</option>
                                            <option value="en-GB">English</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-3">
                                    <TextInputValidated type="number" required name="TermofPayment" label="Term of payment" value={this.state.TermofPayment} onChange={this.handleChange} />
                                </div>
                                <div className="col-sm-3">
                                    <TextInputValidated type="number" required name="Vat" label="Vat %" value={this.state.Vat} onChange={this.handleChange} />
                                </div>
                            </div>

                            <table className="table table-condensed table-hover">
                                <thead>
                                    <tr className="d-none d-md-table-row">
                                        <td>Category</td>
                                        <td>Title</td>
                                        <td>Quantity</td>
                                        <td>Price</td>
                                        <td>Sum</td>
                                        <td className="wrapcolumn"></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.Orderlines && this.state.Orderlines.map(o => <OrderLine key={o.OrderlineID} productCategories={this.state.productCategories} currencies={this.state.currencies} value={o} />)}
                                </tbody>
                                <tfoot>
                                    {this.state.Orderlines &&
                                        <tr>
                                            <td colSpan="4">Total</td>
                                            <td>{this.state.Orderlines.reduce((a, c) => a + c.Price * c.Quantity, 0)} {this.state.CurrencyId}</td>
                                        </tr>
                                    }
                                </tfoot>
                            </table>
                        </ModalBody>
                        <ModalFooter>
                            <ButtonLoading className="btn btn-primary" loading={this.state.loading} type="submit">Save order</ButtonLoading> <ButtonLoading className="btn btn-info" type="button" onClick={this.copyToNew}>Copy to new</ButtonLoading> <button type="button" className="btn btn-default" onClick={this.dismiss}>Cancel</button>
                        </ModalFooter>
                    </div>
                </ValidatedForm>
            </Modal >
        );
    }
}

export default OrderDetail;