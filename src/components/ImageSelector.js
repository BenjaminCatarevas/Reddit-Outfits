import React, { Component } from "react";
import PropTypes from "prop-types";

export class ImageSelector extends Component {
  onClick(imageUrl) {
    this.props.setBigImageToDisplay(imageUrl);
  }

  render() {
    return (
      <div className="row">
        {this.props.outfits.map((outfit, key) => {
          return (
            <div key={key} className="col-xs-2">
              <img
                onClick={this.onClick.bind(this, this.props.outfits[key])}
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
  maxWidth: "500px",
  padding: "5px 5px 5px 5px"
};

ImageSelector.propTypes = {
  outfits: PropTypes.array.isRequired
};

export default ImageSelector;
