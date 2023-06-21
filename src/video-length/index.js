'use strict'

import * as helper from './scripts/helper.js'
import * as preproc from './scripts/preprocess.js'
import * as viz from './scripts/heatmap_viz.js'
import * as legend from './scripts/legend.js'
import * as hover from './scripts/hover.js'
import * as slider from "../components/slider.js";
import * as sortBySelect from "../components/sort-by-select.js";
import * as addons from "./scripts/viz-addons.js";


import * as d3Chromatic from 'd3-scale-chromatic'

import d3Tip from 'd3-tip'

/**
 * Loads the video length tab.
 *
 * @param {*} d3 The d3 library
 */



export function load (d3) {
  let bounds
  let svgSize
  let engagementCategory
  // eslint-disable-next-line no-unused-vars
  let graphSize

  const tip = d3Tip().attr('class', 'd3-tip').html(function (d) { 
    return helper.getContents(d, engagementCategory)
  })
  d3.select('.video-length-heatmap-svg').call(tip)

  const margin = { top: 35, right: 200, bottom: 50, left: 50 }
  // TODO: Use this file for welcom vizs

  d3.csv('./data_source.csv', d3.autoType).then(function (data) {
    const rawData = data
    let dataVideoLengthCategory = preproc.topTenIdealVideo(data)

    slider.append(
      document.querySelector("#video-controls-time-range"),
      new Date(2018, 10, 30),
      new Date(2023, 3, 14),
      updateSelectedDates
    );

    sortBySelect.append(
      document.querySelector("#video-controls-sort-by"),
      {
        "Average Views": "vues",
        "Average Likes": "likes",
        "Average Comments": "commentaires",
        "Average Shares": "partages",
      },
      updateDomainColumn
    );

    let dataFromTo = rawData;
    engagementCategory = 'vues'

    const g = helper.generateG(margin)

    //const gEvolve = helper.generateGLineChart(margin)

    //helper.appendAxes(gEvolve)

    helper.appendAxes(g)

    //helper.initButtons(switchAxis)
   

    setSizing()
    //setSizingEvolve()
    
    build()

    /**
     *   This function handles the graph's sizing.
     */
    function setSizing () {
      bounds = d3
        .select('.video-length-graph')
        .node()
        .getBoundingClientRect()

      svgSize = {
        width: bounds.width,
        height: 500
      }

      graphSize = {
        width: svgSize.width - margin.right - margin.left,
        height: svgSize.height - margin.bottom - margin.top
      }

      helper.setCanvasSize(svgSize.width, svgSize.height)
    }

    // function setSizingEvolve () {
    //   bounds = d3
    //     .select('.video-length-graph-evolve')
    //     .node()
    //     .getBoundingClientRect()

    //   svgSize = {
    //     width: bounds.width,
    //     height: 500
    //   }

    //   graphSize = {
    //     width: svgSize.width - margin.right - margin.left,
    //     height: svgSize.height - margin.bottom - margin.top
    //   }

    //   helper.setCanvasSizeEvolve(svgSize.width, svgSize.height)
    // }

    // function switchAxis (category) {
    //   engagementCategory = category
    //   const g = helper.generateG(margin)

    //   helper.appendAxes(g)
    //   // helper.initButtons()

    //   setSizing()
    //   viz.appendRects(dataVideoLengthCategory, graphSize.width, graphSize.height, engagementCategory, tip)
    //   //build()
    // }


    /**
     * Callback function to update the column used for the x axis
     *
     * @param {*} column The new column to use
     */
    function updateDomainColumn(column) {
      engagementCategory = column;
      build();
    }

    /**
     * Updates the plot with the selected media
     *
     * @param {string[]} mediaList The selected media
     */
    function updateSelectedMedia(mediaList) {
      selectedMediaList = mediaList;
      build();
    }

    /**
     * Updates the plot with the select date range
     *
     * @param {*} fromToDates Object with "from" and "to" properties containing Date objects
     */
    function updateSelectedDates(fromToDates) {
      dataFromTo = rawData;
      dataFromTo = dataFromTo.filter((row) => {
        return (
          new Date(row.date).getTime() >= fromToDates.from.getTime() &&
          new Date(row.date).getTime() <= fromToDates.to.getTime()
        );
      });
      console.log(dataFromTo)
      dataVideoLengthCategory = preproc.topTenIdealVideo(dataFromTo)
      build();
    }

    /**
     *   This function builds the graph.
     */
    function build () {
      viz.appendRects(dataVideoLengthCategory, graphSize.width, graphSize.height, engagementCategory, addons.displayPanel)
      //viz.appendRectsEvolve(data, graphSize.width, graphSize.height, engagementCategory)
    }

    window.addEventListener('resize', () => {
      setSizing()
      //setSizingEvolve()
      build()
    })
  })
}
