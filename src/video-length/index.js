'use strict'

import * as helper from './scripts/helper.js'
import * as preproc from './scripts/preprocess.js'
import * as viz from './scripts/heatmap_viz.js'
import * as legend from './scripts/legend.js'
import * as hover from './scripts/hover.js'

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
  let engagementCategory = 'likes'
  // eslint-disable-next-line no-unused-vars
  let graphSize

  const tip = d3Tip().attr('class', 'd3-tip').html(function (d) { 
    return helper.getContents(d, engagementCategory)
  })
  d3.select('.video-length-heatmap-svg').call(tip)

  const margin = { top: 35, right: 200, bottom: 50, left: 50 }
  // TODO: Use this file for welcom vizs

  d3.csv('./data_source.csv', d3.autoType).then(function (data) {



    const dataVideoLengthCategory = preproc.topTenIdealVideo(data)

    const g = helper.generateG(margin)

    const gEvolve = helper.generateGLineChart(margin)

    helper.appendAxes(gEvolve)

    helper.appendAxes(g)

    helper.initButtons(switchAxis)
   

    setSizing()
    setSizingEvolve()
    
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

    function setSizingEvolve () {
      bounds = d3
        .select('.video-length-graph-evolve')
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

      helper.setCanvasSizeEvolve(svgSize.width, svgSize.height)
    }

    function switchAxis (category) {
      engagementCategory = category
      const g = helper.generateG(margin)

      helper.appendAxes(g)
      // helper.initButtons()

      setSizing()
      viz.appendRects(dataVideoLengthCategory, graphSize.width, graphSize.height, engagementCategory, tip)
      build()
    }

    /**
     *   This function builds the graph.
     */
    function build () {
      viz.appendRects(dataVideoLengthCategory, graphSize.width, graphSize.height, engagementCategory, tip)
      viz.appendRectsEvolve(data, graphSize.width, graphSize.height, engagementCategory)
    }

    window.addEventListener('resize', () => {
      setSizing()
      setSizingEvolve()
      build()
    })
  })
}
