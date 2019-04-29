import React, { Component } from "react";
import BarChart from "./BarChart";

export class Stats extends Component {
  render() {
    //<BarChart data={[5, 10, 1, 3]} size={[500, 500]} />
    return (
      <div>
        <BarChart
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]}
          width={500}
          height={500}
        />
      </div>
    );
  }
}

export default Stats;
