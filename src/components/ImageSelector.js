import React, { Component } from "react";
import PropTypes from "prop-types";

export class ImageSelector extends Component {
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

ImageSelector.propTypes = {
  outfits: PropTypes.array.isRequired
};

export default ImageSelector;
