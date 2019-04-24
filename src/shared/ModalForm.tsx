import { Component } from 'react';

interface IModalFormProps {
    onClosed: (result: any) => void;
}

interface IState {
    modal: boolean;
    result: any;
}

export default class ModalForm extends Component<IModalFormProps, IState> {
    dismiss = () => {
        this.setState({
            modal: false,
            result: false,
        });
    }

    onClosed = () => {
        if (this.props.onClosed) {
            this.props.onClosed(this.state.result);
        }
    }
}
