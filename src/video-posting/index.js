'use strict'

import * as helper from './scripts/helper.js'
import * as preproc from './scripts/preprocess.js'
import * as viz from './scripts/heatmap_viz.js'
import * as legend from './scripts/legend.js'
import * as hover from './scripts/hover.js'
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
  let showTotal = true
  let currentData
  const graphTitleMap = new Map()
    .set('vuesAverage', 'Weekly Average views of Videos Uploaded during each time block')
    .set('vues', 'Total of views during each time block')
    .set('likesAverage', 'Weekly Average likes received during each time block')
    .set('likes', 'Total likes received during each time block')
    .set('commentaires', 'Total amount of comments received during each time block')
    .set('commentairesAverage', 'Weekly Average Amount of comments received during each time block')
    .set('countAverage', 'Weekly Average Amount of Videos Uploaded per Time of Day')
    .set('partages', 'Total amount of comments received during each time block')
    .set('partagesAverage', 'Weekly Average Amount of comments received during each time block')
    .set('count', 'Amount of Videos Uploaded per Time of Day')
  const margin = { top: 50, right: 200, bottom: 35, left: 200 }
  // TODO: Use this file for welcom vizs
  const xScale = d3.scaleBand().padding(0.05)
  const yScale = d3.scaleBand().padding(0.2)
  const colorScale = d3.scaleSequential(d3.interpolateBuPu)
    .domain([0, 1]) // Define the domain of the scale

  const darkColor = '#74427c'
  const paleColor = '#e6d7f4'

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
        'Posts count': 'count'
      },
      updateTargetColumn
    )
    const radioButtons = d3.select('#vp-radio-buttons')

    radioButtons.selectAll('input[type="radio"]')
      .on('change', updateMode)
    data = preproc.addTimeBlocks(preproc.processDateTime(data))

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
      if (selectedMediaList.length > 0) {
        currentData = currentData.filter(row => selectedMediaList.includes(row['média']))
      }
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
      viz.setColorScaleDomain(colorScale, currentData, targetColumn)
      viz.appendRects(currentData)
      legend.initGradient(colorScale)
      legend.initLegendBar()
      legend.initLegendAxis()
      setSizing()

      // Draw the updated legend
      legend.draw(
        margin.left / 2,
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

      hover.setRectHandler(
        xScale,
        yScale,
        hover.rectSelected,
        hover.rectUnselected,
        hover.selectTicks,
        hover.unselectTicks
      )

      legend.update(
        margin.left / 2,
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
