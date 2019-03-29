import React, { Component } from "react";
import PropTypes from "prop-types";

export class ImageSelector extends Component {
  onClick(imageUrl) {
    this.props.setBigImageToDisplay(imageUrl);
    //window.scrollTo(0, this.props.topOfWindowRef.current.offsetTop);
  }

  render() {
    const { outfits } = this.props;
    return (
      <div className="row center-block" style={{ justifyContent: "center" }}>
        {outfits.map((outfit, key) => {
          return (
            <div key={key} style={{ height: "20vh" }} className="col-xs-1">
              <img
                onClick={this.onClick.bind(this, outfits[key])}
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
  height: "100%",
  padding: "5px 5px 5px 5px",
  width: "auto"
};

ImageSelector.propTypes = {
  outfits: PropTypes.array.isRequired
};

export default ImageSelector;
