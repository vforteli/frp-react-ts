import { Component } from 'react';

export interface IModalFormProps {
    onClosed: (result: any) => void;
}

export interface IModalFormState {
    modal: boolean;
    result: any;
}

export default class ModalForm<T extends IModalFormProps, S extends IModalFormState> extends Component<T, S> {
    dismiss = () => {
        this.setState({
            modal: false,
            result: false,
        });
    }

    close = (result: any) => {
        this.setState({
            modal: false,
            result: result,
        });
    }

    onClosed = () => {
        if (this.props.onClosed) {
            this.props.onClosed(this.state.result);
        }
    }
}
