'use strict'

import * as helper from './scripts/helper.js'
import * as preproc from './scripts/preprocess.js'
import * as viz from './scripts/viz.js'
import * as legend from './scripts/legend.js'
import * as menu from '../components/media-selection-menu.js'
import * as slider from '../components/slider.js'
import * as sortBySelect from '../components/sort-by-select.js'

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
  let targetColumn = 'vues'
  let startDate = new Date(2018, 10, 30)
  let endDate = new Date(2023, 3, 14)
  let showTotal
  let currentData
  const graphTitleMap = new Map()
    .set('vuesAverage', 'Weekly Average Views of Videos Uploaded During Each Time Slot')
    .set('vues', 'Total Views of Videos Uploaded During Each Time Slot')
    .set('likesAverage', 'Weekly Average Likes of Videos Uploaded During Each Time Slot')
    .set('likes', 'Total Likes of Videos Uploaded During Each Time Slot')
    .set('commentairesAverage', 'Weekly Average Comments of Videos Uploaded During Each Time Slot')
    .set('commentaires', 'Total Comments of Videos Uploaded During Each Time Slot')
    .set('partages', 'Total Shares of Videos Uploaded During Each Time Slot')
    .set('partagesAverage', 'Weekly Average Shares of Videos Uploaded During Each Time Slot')
    .set('count', 'Amount of Videos Uploaded During Each Time Slot')
    .set('countAverage', 'Weekly Average Amount of Videos Videos Uploaded During Each Time Slot')
  const margin = { top: 70, right: 120, bottom: 50, left: 130 }
  const xScale = d3.scaleBand().padding(0.05)
  const yScale = d3.scaleBand().padding(0.2)
  const colorScale = d3.scaleSequential(d3.interpolateBuPu)
    .domain([0, 1]) // Define the domain of the scale

  const darkColor = '#74427c'
  const paleColor = '#e6d7f4'

  const customInterpolator = t => d3.interpolate(paleColor, darkColor)(t)

  colorScale.interpolator(customInterpolator).nice()

  d3.csv('./data_source.csv', d3.autoType).then(function (data) {
    const mediaList = preproc.getMediaList(data)

    // creates the media selection component
    menu.append(
      document.querySelector('#vp-controls-media-selection'),
      mediaList,
      updateSelectedMedia
    )
    slider.append(
      document.querySelector('#vp-controls-time-range'),
      startDate,
      endDate,
      updateSelectedDates
    )
    sortBySelect.append(
      document.querySelector('#vp-controls-sort-by'),
      {
        Views: 'vues',
        Likes: 'likes',
        Comments: 'commentaires',
        Shares: 'partages',
        'Post Count': 'count'
      },
      updateTargetColumn
    )
    const radioButtons = d3.select('#vp-radio-buttons')

    radioButtons.selectAll('input[type="radio"]')
      .on('change', updateMode)
    data = preproc.addTimeBlocks(preproc.processDateTime(data))

    showTotal = false // show average by default
    updateTargetColumn(targetColumn)

    legend.initGradient(colorScale)
    legend.initLegendBar()
    legend.initLegendAxis()

    const g = helper.generateG(margin)

    helper.appendAxes(g)

    setSizing()
    build()
    /**
     * Updates the plot with the select date range
     *
     * @param {*} fromToDates Object with "from" and "to" properties containing Date objects
     */
    function updateSelectedDates (fromToDates) {
      startDate = fromToDates.from
      endDate = fromToDates.to
      build()
    }
    /**
     * Toggle show mode when a button is clicked
     */
    function updateMode () {
      showTotal = !showTotal
      updateTargetColumn(targetColumn)
    }
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
     * Update target column and redraw
     *
     * @param {string} newTarget the new target column
     */
    function updateTargetColumn (newTarget) {
      if (showTotal) { targetColumn = newTarget.replace('Average', '') } else targetColumn = newTarget + 'Average'
      build()
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
      currentData = currentData.filter(row => selectedMediaList.includes(row['média']))
      currentData = preproc.filterDataByDates(currentData, startDate, endDate)
      currentData = preproc.aggregateColumns(
        currentData,
        ['vues', 'likes', 'partages', 'commentaires'],
        ['dayOfWeek', 'timeBlock']
      )
      if (targetColumn === 'countAverage') {
        currentData = preproc.computeAverageCount(currentData, startDate, endDate)
      }
      currentData = preproc.fill(currentData)
      currentData = preproc.sortByColumns(
        currentData,
        ['vuesAverage', 'vues', 'likes', 'partages', 'commentaires'],
        true
      )

      setSizing()

      const dataExists = currentData.some(timeSlot => timeSlot.count !== 0)
      viz.setHeatmapAsVisible(dataExists, [svgSize.width / 2, 250])

      viz.setColorScaleDomain(colorScale, currentData, targetColumn)
      viz.appendRects(currentData)
      viz.appendNoDataText()
      legend.initGradient(colorScale)
      legend.initLegendBar()
      legend.initLegendAxis()

      // Draw the updated legend
      legend.draw(
        margin.left - 50,
        margin.top + 5,
        graphSize.height - 10,
        15,
        'url(#video-posting-gradient)',
        colorScale
      )
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
      viz.generateGraphTitle(graphTitleMap.get(targetColumn), graphSize.width)
      viz.generateGraphSubtitle(startDate, endDate, graphSize.width)

      legend.update(
        margin.left - 50,
        margin.top + 5,
        graphSize.height - 10,
        colorScale
      )
    }

    window.addEventListener('resize', () => {
      setSizing()
      build()
    })
  })
}
