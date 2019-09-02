import React, { Component } from "react";
import LabeledBarChart from "./LabeledBarChart";

export class Stats extends Component {
  componentDidMount() {
    this.props.getAllThreads();
  }

  render() {
    const { allThreads } = this.props;
    let dataCounters = {
      malefashionadvice: {
        numThreads: 0,
        numTotalComments: 0,
        numTopLevelComments: 0,
        totalScore: 0,
        averageThreadScore: 0,
        averageNumTotalComments: 0,
        averageNumTopLevelComments: 0,
        subreddit: "malefashionadvice"
      },
      femalefashionadvice: {
        numThreads: 0,
        numTotalComments: 0,
        numTopLevelComments: 0,
        totalScore: 0,
        averageThreadScore: 0,
        averageNumTotalComments: 0,
        averageNumTopLevelComments: 0,
        subreddit: "femalefashionadvice"
      },
      streetwear: {
        numThreads: 0,
        numTotalComments: 0,
        numTopLevelComments: 0,
        totalScore: 0,
        averageThreadScore: 0,
        averageNumTotalComments: 0,
        averageNumTopLevelComments: 0,
        subreddit: "streetwear"
      },
      goodyearwelt: {
        numThreads: 0,
        numTotalComments: 0,
        numTopLevelComments: 0,
        totalScore: 0,
        averageThreadScore: 0,
        averageNumTotalComments: 0,
        averageNumTopLevelComments: 0,
        subreddit: "goodyearwelt"
      },
      rawdenim: {
        numThreads: 0,
        numTotalComments: 0,
        numTopLevelComments: 0,
        totalScore: 0,
        averageThreadScore: 0,
        averageNumTotalComments: 0,
        averageNumTopLevelComments: 0,
        subreddit: "rawdenim"
      }
    };
    let chartData = [];

    // Construct objects that condense the data to be displayed by D3
    // Goes through each thread and buckets them by subreddit and aggregates metrics of each subreddit based on threads
    for (let currentThreadIndex in allThreads) {
      let currentThread = allThreads[currentThreadIndex];
      // Add another thread to the number of threads for that subreddit
      dataCounters[currentThread.subreddit].numThreads += 1;
      // Add the number of total comments for the given thread
      dataCounters[currentThread.subreddit].numTotalComments +=
        currentThread.num_total_comments;
      // Add the number of top level comments (outfits) for the given thread to the subreddit
      dataCounters[currentThread.subreddit].numTopLevelComments +=
        currentThread.num_top_level_comments;
      // Add the score of the current thread to the total score of the subreddit
      dataCounters[currentThread.subreddit].totalScore +=
        currentThread.thread_score;
    }

    // Place the newly created objects into an array to be easily handled by D3
    Object.keys(dataCounters).map(key => {
      let currentSubreddit = dataCounters[key];
      // We check if the numThreads property is non-zero. If it is, we just push it to the D3-handling array.
      // This is because in all future uses of numThreads, it is a divider, and thus must not be 0 (else the calculation result is NaN)
      if (!currentSubreddit.numThreads) {
        chartData.push(dataCounters[key]);
      } else {
        // Calculate averages for each subreddit and then push into D3-handling array
        currentSubreddit.averageThreadScore = Math.floor(
          currentSubreddit.totalScore / currentSubreddit.numThreads
        );
        currentSubreddit.averageNumTotalComments = Math.floor(
          currentSubreddit.numTotalComments / currentSubreddit.numThreads
        );
        currentSubreddit.averageNumTopLevelComments = Math.floor(
          currentSubreddit.numTopLevelComments / currentSubreddit.numThreads
        );
        chartData.push(dataCounters[key]);
      }
      return true;
    });

    return allThreads ? (
      <div>
        <div style={svgStyle}>
          <LabeledBarChart
            xAxisLabel={"Subreddit"}
            yAxisLabel={"Number of threads"}
            data={chartData}
            width={1000}
            height={400}
          />
        </div>
      </div>
    ) : (
      <div />
    );
  }
}

const svgStyle = {
  // Forces the SVG element to have a scrollbar to fit in line with the rest of the page.
  // The width and height must be smaller than the SVG element.
  width: "900",
  height: "900",
  overflow: "auto"
};

export default Stats;
