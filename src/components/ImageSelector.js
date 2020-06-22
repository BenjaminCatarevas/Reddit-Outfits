import React, { Component } from "react";
import PropTypes from "prop-types";

export class ImageSelector extends Component {
  state = {
    imageHovered: false,
    /**
     * We use this to keep track of the individual outfit that should be transformed.
     * Without this, each set of images would hover at the same time.
     * When setting the style of the image, we use both of these variables to determine if a single image should hover.
     */
    currentHoveredImage: null
  };

  /**
   * This function receives an image clicked on by the end user and sets the BigImageDisplay component to this image.
   * It also resets the window to the top of the parent component.
   * @param {string} imageUrl Image URL of the image ot be displayed in the BigImageDisplay component.
   */
  onClick(imageUrl) {
    this.props.setBigImageToDisplay(imageUrl);
    window.scrollTo(0, this.props.topOfWindowRef.current.offsetTop);
  }

  render() {
    const { outfits } = this.props;
    return (
      <div className="row center-block" style={{ justifyContent: "center" }}>
        {outfits.map((outfit, key) => {
          return (
            <div key={outfit} style={{ height: "20vh" }} className="col-xs-1">
              <img
                onClick={this.onClick.bind(this, outfit)}
                style={
                  this.state.imageHovered &&
                  this.state.currentHoveredImage === outfit
                    ? hoverImageStyle
                    : noHoverImageStyle
                }
                className="img-responsive"
                onMouseOut={() => {
                  this.setState({
                    imageHovered: false,
                    currentHoveredImage: null
                  });
                }}
                onMouseOver={() =>
                  this.setState({
                    imageHovered: true,
                    currentHoveredImage: outfit
                  })
                }
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

const noHoverImageStyle = {
  height: "100%",
  width: "auto",
  marginLeft: "5px",
  marginTop: "-5px",
  boxShadow: "3px 3px 10px gray"
};

const hoverImageStyle = {
  height: "100%",
  width: "auto",
  marginLeft: "5px",
  marginTop: "-5px",
  boxShadow: "3px 3px 10px gray",
  // Adapted from: https://stackoverflow.com/a/5449041
  position: "relative",
  top: "-5px"
};

ImageSelector.propTypes = {
  outfits: PropTypes.array.isRequired
};

export default React.forwardRef((props, ref) => {
  return <ImageSelector {...props} topOfWindowRef={ref} />;
});
