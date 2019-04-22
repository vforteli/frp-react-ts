import axios from 'axios';
import moment from 'moment';
import React, { Component, Fragment } from 'react';

interface IState {
    documentItems: IDocumentItem[] | null;
}

interface IDocumentItem {
    Id: number;
    Category: string;
    Path: string;
    Filename: string;
    Created: string;
    HitHighlightedSummary: string;
}

class DocumentsList extends Component<{}, IState> {
    state: IState = {
        documentItems: null,
    };

    async componentDidMount() {
        const response = await axios.get('https://documents.flexinets.se/documents/?number=10');
        this.setState({ documentItems: response.data });
    }


    render() {
        return (
            <Fragment>
                <h4>Latest documents</h4>
                <div className='news'>
                    {this.state.documentItems === null && <div className='chartloading'></div>}
                    <table className='documentstable'>
                        <tbody>
                            {this.state.documentItems &&
                                this.state.documentItems.map((item, index) =>
                                    <tr key={index}>
                                        <td>{moment(item.Created).format('MMMM Do')}</td>
                                        <td><a href={'https://documents.flexinets.se/documents/download/' + item.Filename}>{item.Filename}</a></td>
                                    </tr>,
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </Fragment>
        );
    }
}

export default DocumentsList;
