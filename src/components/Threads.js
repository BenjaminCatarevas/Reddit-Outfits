import React, { Component } from 'react'
import Thread from './Thread';

export class Threads extends Component {

    componentDidMount() {
        this.props.getAllThreads();
    }

    render() {
        // If the threads state is null, return an empty div, else return Thread components for each thread.
        return this.props.allThreads ? this.props.allThreads.map((thread) => {
            return <Thread key={thread.thread_id} threadInformation={thread} />
        }) : <div></div>
    }
}

export default Threads
