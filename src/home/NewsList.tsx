import axios from 'axios';
import moment from 'moment';
import React, { Component, Fragment } from 'react';

interface IState {
    newsItems: INewsItem[] | null;
}

interface INewsItem {
    NewsId: number;
    TextShort: string;
    Text: string;
    Title: string;
    CreatedOn: string;
    Url: string;
}

class NewsList extends Component<{}, IState> {
    state: IState = { newsItems: null };

    async componentDidMount() {
        const response = await axios.get('https://api.flexinets.se/api/news/');
        this.setState({ newsItems: response.data });
    }


    render() {
        return (
            <Fragment>
                <h4>News</h4>
                <div className='news'>
                    {this.state.newsItems === null && <div className='chartloading'></div>}
                    {this.state.newsItems &&
                        this.state.newsItems.map((item, index) =>
                            <article key={index}>
                                <span className='newsdate'>{moment(item.CreatedOn).format('MMMM Do')}</span>
                                <header>{item.Title}</header>
                                <p dangerouslySetInnerHTML={{ __html: item.Text }}></p>
                                <a href={item.Url}>Read more</a>
                            </article>,
                        )
                    }
                </div>
            </Fragment>
        );
    }
}

export default NewsList;
