'use strict'

import * as helper from './scripts/helper.js'
import * as preproc from './scripts/preprocess.js'
import * as viz from './scripts/heatmap_viz.js'

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
  d3.select('.hashtags-heatmap-svg').call(tip)

  const margin = { top: 35, right: 200, bottom: 50, left: 50 }

  d3.csv('./data_source.csv', d3.autoType).then(function (csvData) {

    // Certainly to modify in the future


    const g = helper.generateG(margin)

    helper.appendAxes(g)
    helper.initButtons(switchAxis)
    setSizing()
    build()

    /**
     *   This function handles the graph's sizing.
     */
    function setSizing () {
      bounds = d3
        .select('.hashtags-graph')
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

    function switchAxis (category) {
      engagementCategory = category
      const g = helper.generateG(margin)

      helper.appendAxes(g)
      // helper.initButtons()

      const data = preproc.regrouperParHashtags(csvData).sort((a, b) => b[category] - a[category]).slice(0, 10)

      setSizing()
      viz.appendRects(data, graphSize.width, graphSize.height, engagementCategory, tip)
      build()
    }

    /**
     *   This function builds the graph.
     */
    function build () {
      const data = preproc.regrouperParHashtags(csvData).sort((a, b) => b[engagementCategory] - a[engagementCategory]).slice(0, 10)
      viz.appendRects(data, graphSize.width, graphSize.height, engagementCategory, tip)
    }

    window.addEventListener('resize', () => {
      setSizing()
      build()
    })
  })
}
