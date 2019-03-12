import React, { Component } from 'react'

export class ImageSelector extends Component {
    // Pass in images via props to display them
    // Each image is 2 wide?
  render() {
    return (
      <div className="row">
          {this.props.outfits.map((outfit, key) => {
            return (
              <div key={key} className="col-xs-6">
                <img className="img-fluid" src={outfit} alt={outfit}/> 
              </div>
            )
          })}
      </div>
    )
  }
}

export default ImageSelector
