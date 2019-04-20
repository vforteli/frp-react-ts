import React, { Component, Fragment } from 'react';
import axios from 'axios';
import moment from 'moment';

class NewsList extends Component {
    constructor(props) {
        super(props);

        this.state = { newsItems: null };
    }

    async componentDidMount() {
        const response = await axios.get('https://api.flexinets.se/api/news/');
        this.setState({ newsItems: response.data });
    }


    render() {
        return (
            <Fragment>
                <h4>News</h4>
                <div className="news">
                    {this.state.newsItems === null && <div className="chartloading"></div>}
                    {this.state.newsItems &&
                        this.state.newsItems.map((item, index) =>
                            <article key={index}>
                                <span className="newsdate">{moment(item.CreatedOn).format('MMMM Do')}</span>
                                <header>{item.Title}</header>
                                <p dangerouslySetInnerHTML={{ __html: item.Text }}></p>
                                <a href={item.Url}>Read more</a>
                            </article>
                        )
                    }
                </div>
            </Fragment>
        );
    }
}


export default NewsList;