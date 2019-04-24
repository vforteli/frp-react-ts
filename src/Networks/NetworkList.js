import React from 'react';
import axios from 'axios';

class NetworkList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageSize: 50,
            currentPage: 1,
            accounts: null,
            count: 0
        }
    }

    async componentDidMount() {
        const response = await axios.get('/Api/v2/CrmAccounts/');
        this.setState({
            accounts: response.data.Accounts,
            count: response.data.Count
        });
    }

    pageChanged = (page) => {
        console.debug(`Yay page changed to ${page}`);
        this.setState({ currentPage: page });
    }

    render() {
        return (
            <div className="container">
                <h3>Networks</h3>

              
            </div>
        )
    }
}

export default NetworkList