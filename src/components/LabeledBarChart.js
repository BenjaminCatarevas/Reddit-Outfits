import React, { Component } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { max } from "d3-array";
import { select } from "d3-selection";
// eslint-disable-next-line
import { transition } from "d3-transition";
import { withRouter } from "react-router-dom";

/*
RESOURCES:
- https://bl.ocks.org/alanvillalobos/14e9f0d80ea6b0d8083ba95a9d571d13

*/

class LabeledBarChart extends Component {
  // Called because we use .bind
  constructor(props) {
    super(props);
    // Set the function to have access to `this` so it can access the node reference and modify D3 elements.
    this.createLabeledBarChart = this.createLabeledBarChart.bind(this);
    // This function removes the old SVG when transitioning from one chart to another
    this.removeOldSvg = this.removeOldSvg.bind(this);
    // These functions update based on various metrics
  }

  componentDidMount() {
    this.removeOldSvg();
    this.createLabeledBarChart("numThreads", "Number of threads");
  }

  componentWillUpdate() {
    /*
    We call createdLabeledBarChart() because the only way the component technically updates
    is when it is accessed by the Stats routerLink.
    */
    this.removeOldSvg();
    this.createLabeledBarChart("numThreads", "Number of threads");
  }

  createLabeledBarChart(sortedProperty, yAxisLabel) {
    // Define the dimensions and margins of the graph
    let margin = { top: 20, right: 20, bottom: 70, left: 70 };
    let width = this.props.width - margin.left - margin.right;
    let height = this.props.height - margin.top - margin.bottom;
    // Padding to align axes, answer adapted from: https://stackoverflow.com/a/40754024
    const axisPadding = 50;

    // Create the node object that we'll use to append the graph to
    const node = this.node;

    // Create the X and Y scales
    let xScale = scaleBand()
      .range([0, width], 0.05)
      .padding(0.1);

    let yScale = scaleLinear().range([height, 0]);

    // Set the domains of the X and Y axes
    xScale.domain(
      this.props.data.map(d => {
        return d.subreddit;
      })
    );

    yScale.domain([
      0,
      max(this.props.data, d => {
        return d[sortedProperty];
      })
    ]);

    // Create the X and Y axes
    let xAxis = axisBottom().scale(xScale);

    let yAxis = axisLeft().scale(yScale);

    // Set the dimensions of the graph
    select(node)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the X axis
    select(node)
      .append("g")
      .attr("transform", "translate(" + axisPadding + "," + height + ")")
      .call(xAxis);

    // Add X axis label
    select(node)
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
      )
      .style("text-anchor", "middle")
      .text(this.props.xAxisLabel);

    // Add the Y axis
    select(node)
      .append("g")
      .attr("class", "yAxis")
      .attr("transform", "translate(" + axisPadding + ",0)")
      .call(yAxis);

    // Add the Y axis label
    select(node)
      .select(".yAxis")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("fill", "black")
      .text(yAxisLabel);

    // Add the rects to the graph (but currently are empty)
    select(node)
      .selectAll("rect")
      .data(this.props.data)
      .enter()
      .append("rect")
      .style("fill", "steelblue")
      .attr("x", d => {
        return xScale(d.subreddit) + axisPadding;
      })
      .attr("width", xScale.bandwidth())
      .attr("y", d => height)
      .transition()
      .duration(1000)
      .attr("y", d => {
        return yScale(d[sortedProperty]);
      })
      .attr("height", d => {
        return height - yScale(d[sortedProperty]);
      });
  }

  removeOldSvg() {
    // Answer adapted from: https://stackoverflow.com/questions/10784018/how-can-i-remove-or-replace-svg-content
    const node = this.node;

    select(node)
      .selectAll("*")
      .remove();
  }

  updateBarChart(sortedProperty, yAxisLabel) {
    this.removeOldSvg();
    this.createLabeledBarChart(sortedProperty, yAxisLabel);
  }

  updateData = event => {
    // Approach adapted from: https://stackoverflow.com/a/28868135
    let selection = event.target.value;
    switch (selection) {
      case "0":
        this.updateBarChart("numThreads", "Total threads");
        break;
      case "1":
        this.updateBarChart("numTotalComments", "Total comments");
        break;
      case "2":
        this.updateBarChart("numTopLevelComments", "Total outfits");
        break;
      case "3":
        this.updateBarChart("totalScore", "Total score");
        break;
      case "4":
        this.updateBarChart("averageThreadScore", "Average thread score");
        break;
      case "5":
        this.updateBarChart(
          "averageNumTotalComments",
          "Average total comments per thread"
        );
        break;
      case "6":
        this.updateBarChart(
          "averageNumTopLevelComments",
          "Average outfits per thread"
        );
        break;
      default:
        this.updateBarChart("numThreads", "Number of threads");
    }
  };

  render() {
    return (
      <div>
        <div id="selector-div" style={selectorPadding}>
          <select id="selector" onChange={this.updateData}>
            <option value="0">Number of threads</option>
            <option value="1">Number of total comments</option>
            <option value="2">Number of top level comments (outfits)</option>
            <option value="3">Total score</option>
            <option value="4">Average thread score</option>
            <option value="5">Average number of total comments</option>
            <option value="6">
              Average number of top level comments (outfits)
            </option>
          </select>
        </div>
        <svg
          ref={node => (this.node = node)}
          width={this.props.width}
          height={this.props.height}
        />
      </div>
    );
  }
}

const selectorPadding = {
  padding: "15px"
};

export default withRouter(LabeledBarChart);
