import React, { Component } from 'react';
import DocumentsList from './DocumentsList';
import NewsList from './NewsList';

class Home extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card newsbox">
                            <div className="card-body">
                                <NewsList />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card newsbox">
                            <div className="card-body">
                                <DocumentsList />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;