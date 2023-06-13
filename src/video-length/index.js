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
  // const xScale = d3.scaleBand().padding(0.05)
  // const yScale = d3.scaleBand().padding(0.2)
  // const colorScale = d3.scaleSequential(d3Chromatic.interpolateBuPu)

  d3.csv('./data_source.csv', d3.autoType).then(function (data) {
    // These are just examples
    // data = preproc.addTimeBlocks(preproc.processDateTime(data))
    // data = preproc.aggregateColumns(
    //   data,
    //   ['vues', 'likes', 'partages', 'commentaires'],
    //   ['dayOfWeek', 'timeBlock']
    // )
    // data = preproc.sortByColumns(
    //   data,
    //   ['averageVues', 'vues', 'likes', 'partages', 'commentaires'],
    //   true
    // )
    // data = preproc.normalizeColumn(data, 'vuesAverage')
    // viz.setColorScaleDomain(colorScale, data, 'vuesAverageNormalized')


    data = preproc.topTenIdealVideo(data)

    // legend.initGradient(colorScale)
    // legend.initLegendBar()
    // legend.initLegendAxis()

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

    function switchAxis (category) {
      engagementCategory = category
      const g = helper.generateG(margin)

      helper.appendAxes(g)
      // helper.initButtons()

      setSizing()
       console.log(engagementCategory)
       viz.appendRects(data, graphSize.width, graphSize.height, engagementCategory, tip)
      build()
    }

    /**
     *   This function builds the graph.
     */
    function build () {
      viz.appendRects(data, graphSize.width, graphSize.height, engagementCategory, tip)
      // viz.updateXScale(xScale, graphSize.width)
      // viz.updateYScale(
      //   yScale,
      //   preproc.getUniqueTimeBlocks(data),
      //   graphSize.height
      // )

      // viz.drawXAxis(xScale)
      // viz.drawYAxis(yScale, graphSize.width)

      // viz.rotateYTicks()

      // viz.updateRects(xScale, yScale, colorScale)

      // hover.setRectHandler(
      //   xScale,
      //   yScale,
      //   hover.rectSelected,
      //   hover.rectUnselected,
      //   hover.selectTicks,
      //   hover.unselectTicks
      // )

      // legend.draw(
      //   margin.left / 2,
      //   margin.top + 5,
      //   graphSize.height - 10,
      //   15,
      //   'url(#gradient)',
      //   colorScale
      // )
    }

    window.addEventListener('resize', () => {
      setSizing()
      build()
    })
  })
}
