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

  const graphTitleMap = new Map()
    .set('vues', 'Average view count per video length')
    .set('likes', 'Average like count per video length')
    .set('commentaires', 'Average comment count per video length')
    .set('partages', 'Average share count per video length')
  const fromToDates = {
    from: new Date(2018, 10, 30),
    to: new Date(2023, 3, 14)
  }

  const colorScale = d3.scaleSequential(d3.interpolateBuPu)
    .domain([0, 1]) // Define the domain of the scale

  const darkColor = '#74427c'
  const paleColor = '#e6d7f4'

  const customInterpolator = t => d3.interpolate(paleColor, darkColor)(t)

  colorScale.interpolator(customInterpolator)

  const tip = d3Tip().attr('class', 'd3-tip').html(function (d) { 
    return helper.getContents(d, engagementCategory)
  })
  d3.select('.video-length-heatmap-svg').call(tip)

  const margin = { top: 75, right: 200, bottom: 50, left: 50 }
  // TODO: Use this file for welcom vizs

  d3.csv('./data_source.csv', d3.autoType).then(function (data) {
    const rawData = data
    let dataVideoLengthCategory = preproc.topTenIdealVideo(data)
    let max = preproc.findMax(dataVideoLengthCategory)
    let min = preproc.findMin(dataVideoLengthCategory)

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


    legend.initGradient(colorScale)
    legend.initLegendBar()
    legend.initLegendAxis()

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
    function updateSelectedDates(fromToDatesParam) {
      dataFromTo = rawData;
      fromToDates.from = fromToDatesParam.from
      fromToDates.to = fromToDatesParam.to
      dataFromTo = dataFromTo.filter((row) => {
        return (
          new Date(row.date).getTime() >= fromToDates.from.getTime() &&
          new Date(row.date).getTime() <= fromToDates.to.getTime()
        );
      });
      dataVideoLengthCategory = preproc.topTenIdealVideo(dataFromTo)
      max = preproc.findMax(dataVideoLengthCategory)
      min = preproc.findMin(dataVideoLengthCategory)

      build();
    }

    /**
     *   This function builds the graph.
     */
    function build () {
      viz.appendRects(dataVideoLengthCategory, graphSize.width, graphSize.height, engagementCategory, addons.displayPanel)
      viz.generateGraphTitle(graphTitleMap.get(engagementCategory), graphSize.width)
      viz.generateGraphSubtitle(fromToDates.from, fromToDates.to, graphSize.width)

      // Draw the updated legend
      legend.draw(
        svgSize.width - 90,
        margin.top + 5,
        graphSize.height - 10,
        15,
        'url(#video-length-gradient)',
        colorScale,
        preproc.genererTableauEquilibre(min,max)
      )
      //viz.appendRectsEvolve(data, graphSize.width, graphSize.height, engagementCategory)
    }

    window.addEventListener('resize', () => {
      setSizing()
      //setSizingEvolve()
      build()
    })
  })
}





