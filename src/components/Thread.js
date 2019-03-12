import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

export class Thread extends Component {
    render() {
        let threadDate = new Date(this.props.threadInformation.timestamp);
        let humanDate = threadDate.toDateString();

        let numOutfits = this.props.threadInformation.num_top_level_comments;
        let numTotalComments = this.props.threadInformation.num_total_comments

        /*
        num_top_level_comments: 1
        num_total_comments: null
        subreddit: "malefashionadvice"
        subreddit_id: "t5_2r65t"
        thread_id: "test"
        thread_permalink: "test"
        thread_score: 1
        thread_title: "test"
        timestamp: 1
        */

        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-6">
                        <h3 className="text-center"><a href="this.props.threadInformation.thread_permalink">{humanDate}</a></h3>
                        <h3 className="text-center">Number of outfits: {numOutfits}</h3>
                        <h3 className="text-center">Number of total comments: {numTotalComments}</h3>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Thread)
