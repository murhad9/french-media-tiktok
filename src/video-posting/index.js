'use strict'

import * as helper from './scripts/helper.js'
import * as preproc from './scripts/preprocess.js'
import * as viz from './scripts/heatmap_viz.js'
import * as legend from './scripts/legend.js'
import * as hover from './scripts/hover.js'
import * as menu from '../components/media-selection-menu.js'
import * as slider from '../components/slider.js'
import * as sortBySelect from '../components/sort-by-select.js'
import * as d3Chromatic from 'd3-scale-chromatic'

/**
 * Loads the video posting tab.
 *
 * @param {*} d3 The d3 library
 */
export function load (d3) {
  let bounds
  let svgSize
  let graphSize
  let selectedMediaList = []
  let targetColumn = 'vuesAverage'
  let currentData
  const margin = { top: 35, right: 200, bottom: 35, left: 200 }
  // TODO: Use this file for welcom vizs
  const xScale = d3.scaleBand().padding(0.05)
  const yScale = d3.scaleBand().padding(0.2)
  const colorScale = d3.scaleSequential(d3.interpolateBuPu)
    .domain([0, 1]) // Define the domain of the scale

  const darkColor = '#74427c'
  const paleColor = '#fcf5fd'

  const customInterpolator = t => d3.interpolate(paleColor, darkColor)(t)

  colorScale.interpolator(customInterpolator)

  d3.csv('./data_source.csv', d3.autoType).then(function (data) {
    // These are just examples
    const mediaList = preproc.getMediaList(data)

    // creates the media selection component
    menu.append(
      document.querySelector('#vp-controls-media-selection'),
      mediaList,
      updateSelectedMedia
    )
    data = preproc.addTimeBlocks(preproc.processDateTime(data))

    legend.initGradient(colorScale)
    legend.initLegendBar()
    legend.initLegendAxis()

    const g = helper.generateG(margin)

    helper.appendAxes(g)

    setSizing()
    build()

    /**
     *   This function handles the graph's sizing.
     */
    function setSizing () {
      bounds = d3
        .select('.video-posting-graph')
        .node()
        .getBoundingClientRect()

      svgSize = {
        width: bounds.width,
        height: 550
      }

      graphSize = {
        width: svgSize.width - margin.right - margin.left,
        height: svgSize.height - margin.bottom - margin.top
      }

      helper.setCanvasSize(svgSize.width, svgSize.height)
    }
    /**
     * Updates the plot with the selected media
     *
     * @param {string[]} mediaList The selected media
     */
    function updateSelectedMedia (mediaList) {
      selectedMediaList = mediaList
      build()
    }
    /**
     * function to process data before build
     */
    function process () {
      currentData = data
      console.log(selectedMediaList)
      if (selectedMediaList.length > 0) {
        currentData = currentData.filter(row => selectedMediaList.includes(row['média']))
      }
      console.log(currentData.length)
      currentData = preproc.aggregateColumns(
        currentData,
        ['vues', 'likes', 'partages', 'commentaires'],
        ['dayOfWeek', 'timeBlock']
      )
      // console.log(currentData)
      currentData = preproc.sortByColumns(
        currentData,
        ['vuesAverage', 'vues', 'likes', 'partages', 'commentaires'],
        true
      )
      viz.setColorScaleDomain(colorScale, currentData, targetColumn)
      viz.appendRects(currentData)
    }
    /**
     *   This function builds the graph.
     */
    function build () {
      process()
      viz.updateXScale(xScale, graphSize.width)
      viz.updateYScale(
        yScale,
        preproc.getUniqueTimeBlocks(currentData),
        graphSize.height
      )

      viz.drawXAxis(xScale)
      viz.drawYAxis(yScale, graphSize.width)

      viz.rotateYTicks()

      viz.updateRects(xScale, yScale, colorScale, targetColumn)

      hover.setRectHandler(
        xScale,
        yScale,
        hover.rectSelected,
        hover.rectUnselected,
        hover.selectTicks,
        hover.unselectTicks
      )

      legend.draw(
        margin.left / 2,
        margin.top + 5,
        graphSize.height - 10,
        15,
        'url(#video-posting-gradient)',
        colorScale
      )
    }

    window.addEventListener('resize', () => {
      setSizing()
      build()
    })
  })
}
