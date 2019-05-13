import React, { Component } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { max } from "d3-array";
import { select } from "d3-selection";
// eslint-disable-next-line
import { transition } from "d3-transition";
import { isoParse, timeFormat } from "d3-time-format";
import { withRouter } from "react-router-dom";

class BarChart extends Component {
  // Called because we use .bind
  constructor(props) {
    super(props);
    // Set the function to have access to `this` so it can access the node reference and modify D3 elements.
    this.createBarChart = this.createBarChart.bind(this);
    // This function removes the old SVG when transitioning from one chart to another
    this.removeOldSvg = this.removeOldSvg.bind(this);
    // These functions update the data based on score or data
    this.sortByAscendingScore = this.sortByAscendingScore.bind(this);
    this.sortByDescendingScore = this.sortByDescendingScore.bind(this);
    this.sortByAscendingDate = this.sortByAscendingDate.bind(this);
    this.sortByDescendingDate = this.sortByDescendingDate.bind(this);
  }

  /* Ref forwarding adapted from: https://github.com/kriasoft/react-starter-kit/issues/909#issuecomment-252969542 */
  componentDidMount() {
    this.props.onRef(this);
    this.createBarChart();
  }

  componentWillUpdate() {
    this.removeOldSvg();
    this.createBarChart();
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  createBarChart() {
    // Bar chart design adapted from: https://bl.ocks.org/zigahertz/1ee4965ff76514517bb7ce6af21e5d44 and https://bl.ocks.org/d3noob/0e276dc70bb9184727ee47d6dd06e915
    // Define the dimensions and margins of the graph
    let margin = { top: 20, right: 20, bottom: 70, left: 70 };
    let width = this.props.width - margin.left - margin.right;
    let height = 300 - margin.top - margin.bottom;
    // Padding to align axes, answer adapted from: https://stackoverflow.com/a/40754024
    const axisPadding = 30;

    // Create the node object that we'll use to append the graph to
    const node = this.node;

    // Define the scales for the X and Y axes
    let xScale = scaleBand()
      .rangeRound([0, width], 0.05)
      .padding(0.1);

    let yScale = scaleLinear().range([height, 0]);

    // Create the axes for X and Y
    let xAxis = axisBottom()
      .scale(xScale)
      .tickFormat(timeFormat("%Y-%m-%d"));

    let yAxis = axisLeft()
      .scale(yScale)
      .ticks(10);

    // Set the dimensions of the graph
    select(node)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Format the date so that it can be displayed properly
    this.props.data.forEach(d => {
      d.date = isoParse(d.date);
    });

    // Scale the range (limit the data to within the highest and lowest respective data)
    xScale.domain(
      this.props.data.map(d => {
        return d.date;
      })
    );

    yScale.domain([
      0,
      max(this.props.data, d => {
        return d.score;
      })
    ]);

    // Add the X axis
    select(node)
      .append("g")
      .attr("transform", "translate(" + axisPadding + "," + height + ")")
      .attr("class", "xAxis")
      .call(xAxis);

    // Add X axis label
    select(node)
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 60) + ")"
      )
      .style("text-anchor", "middle")
      .text(this.props.xAxisLabel);

    // Add the Y axis
    select(node)
      .append("g")
      .attr("transform", "translate(" + axisPadding + ",0)")
      .attr("class", "yAxis")
      .call(yAxis);

    // Add the rects to the graph (but currently are empty)
    select(node)
      .selectAll("rect")
      .data(this.props.data)
      .enter()
      .append("rect");

    // Fill in the rects
    select(node)
      .selectAll("rect")
      .data(this.props.data)
      .style("fill", "steelblue")
      .attr("x", d => {
        return xScale(d.date) + 30;
      })
      .attr("width", xScale.bandwidth())
      .attr("y", d => height)
      .transition()
      .duration(1000)
      .attr("y", d => {
        return yScale(d.score);
      })
      .attr("height", d => {
        return height - yScale(d.score);
      });

    // Add "on" functionality for bars
    select(node)
      .selectAll("rect")
      .on("click", d => {
        window.open(d.commentPermalink);
      });

    // Transition in the X axis
    select(node)
      .select(".xAxis")
      .transition()
      .duration(1000)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");

    // Transition in the Y axis
    select(node)
      .select(".yAxis")
      .transition()
      .duration(1000)
      .call(yAxis);

    // Add the Y axis label (we cannot do this in the call above because it is being transitioned in)
    select(node)
      .select(".yAxis")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("fill", "black")
      .text(this.props.yAxisLabel);
  }

  removeOldSvg() {
    // Answer adapted from: https://stackoverflow.com/questions/10784018/how-can-i-remove-or-replace-svg-content
    const node = this.node;

    select(node)
      .selectAll("*")
      .remove();
  }

  // Adapted from: https://bl.ocks.org/martinjc/7fa5deb1782da2fc6da15c3fad02c88b
  sortByAscendingScore() {
    this.props.data.sort((a, b) => {
      return a.score > b.score ? 1 : -1;
    });
    this.removeOldSvg();
    this.createBarChart();
  }

  sortByDescendingScore() {
    this.props.data.sort((a, b) => {
      return a.score < b.score ? 1 : -1;
    });
    this.removeOldSvg();
    this.createBarChart();
  }

  sortByAscendingDate() {
    this.props.data.sort((a, b) => {
      return a.date > b.date ? 1 : -1;
    });
    this.removeOldSvg();
    this.createBarChart();
  }

  sortByDescendingDate() {
    this.props.data.sort((a, b) => {
      return a.date < b.date ? 1 : -1;
    });
    this.removeOldSvg();
    this.createBarChart();
  }

  render() {
    return (
      <div>
        <svg
          ref={node => (this.node = node)}
          width={this.props.width}
          height={this.props.height}
        />
      </div>
    );
  }
}
export default withRouter(BarChart);
