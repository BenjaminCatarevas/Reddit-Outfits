import React from "react";

export default function About() {
  return (
    <div style={aboutStyling}>
      <p>Created by Benjamin Catarevas</p>
      <p>Special thanks to the following:</p>
      <p>n1c, for the original idea</p>
      <p>Keshav Patel, for continuous support and help</p>
    </div>
  );
}

const aboutStyling = {
  textAlign: "center",
  paddingTop: "5px"
};
