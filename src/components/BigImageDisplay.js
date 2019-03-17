import React, { Component } from 'react'

export class BigImageDisplay extends Component {
    // Make sure to display comment as Markdown
  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
            <img style={bigImageStyle} className="float-left" src={"https://i.imgur.com/kX0DYxx.jpg"} alt={"https://i.imgur.com/kX0DYxx.jpg"}></img>
            <div className="col-xs-12">
              <p>{this.props.comment}</p>
            </div> 
          </div>
        </div>
      )
    }
  }

const bigImageStyle = {
  width: '50%',
  height: 'auto',
  maxWidth: '1000px',
}

export default BigImageDisplay
