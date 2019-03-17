import React, { Component } from "react";

export class ImageSelector extends Component {
  // Pass in images via props to display them
  // Each image is 2 wide?
  // <img className="img-fluid" src={outfit} alt={outfit}/>
  render() {
    return (
      <div className="row">
        {this.props.outfits.map((outfit, key) => {
          return (
            <div key={key} className="col-xs-2">
              <img
                style={imageStyle}
                className="img-responsive"
                src={outfit}
                alt={outfit}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

const imageStyle = {
  width: "20%",
  height: "auto",
  maxWidth: "500"
};

export default ImageSelector;
