import React, { Component } from 'react'

export class BigImageDisplay extends Component {
    // Make sure to display comment as Markdown
  render() {
    return (
      <div className="row">
        <div className="col-xs-4">
            <img className="img-responsive" src={this.props.outfit} alt={this.props.outfit}></img>
        </div>
      </div>
    )
  }
}

export default BigImageDisplay
