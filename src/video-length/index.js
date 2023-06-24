'use strict'

import * as helper from './scripts/helper.js'
import * as preproc from './scripts/preprocess.js'
import * as viz from './scripts/viz.js'
import * as slider from '../components/slider.js'
import * as sortBySelect from '../components/sort-by-select.js'
import * as addons from './scripts/viz-addons.js'

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

  const tip = d3Tip().attr('class', 'd3-tip').html(function (d) {
    return helper.getContents(d, engagementCategory)
  })
  d3.select('.video-length-heatmap-svg').call(tip)

  const margin = { top: 75, right: 200, bottom: 50, left: 50 }

  d3.csv('./data_source.csv', d3.autoType).then(function (data) {
    const rawData = data
    let dataVideoLengthCategory = preproc.topTenIdealVideo(data)

    slider.append(
      document.querySelector('#video-controls-time-range'),
      new Date(2018, 10, 30),
      new Date(2023, 3, 14),
      updateSelectedDates
    )

    sortBySelect.append(
      document.querySelector('#video-controls-sort-by'),
      {
        'Average Views': 'vues',
        'Average Likes': 'likes',
        'Average Comments': 'commentaires',
        'Average Shares': 'partages'
      },
      updateDomainColumn
    )

    let dataFromTo = rawData
    engagementCategory = 'vues'

    const g = helper.generateG(margin)

    helper.appendAxes(g)

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

    /**
     * Callback function to update the column used for the x axis
     *
     * @param {*} column The new column to use
     */
    function updateDomainColumn (column) {
      engagementCategory = column
      build()
    }

    /**
     * Updates the plot with the select date range
     *
     * @param {*} fromToDates Object with "from" and "to" properties containing Date objects
     * @param fromToDatesParam
     */
    function updateSelectedDates (fromToDatesParam) {
      dataFromTo = rawData
      fromToDates.from = fromToDatesParam.from
      fromToDates.to = fromToDatesParam.to
      dataFromTo = dataFromTo.filter((row) => {
        return (
          new Date(row.date).getTime() >= fromToDates.from.getTime() &&
          new Date(row.date).getTime() <= fromToDates.to.getTime()
        )
      })
      dataVideoLengthCategory = preproc.topTenIdealVideo(dataFromTo)
      build()
    }

    /**
     *   This function builds the graph.
     */
    function build () {
      viz.appendRects(dataVideoLengthCategory, graphSize.width, graphSize.height, engagementCategory, addons.displayPanel)
      viz.generateGraphTitle(graphTitleMap.get(engagementCategory), graphSize.width)
      viz.generateGraphSubtitle(fromToDates.from, fromToDates.to, graphSize.width)
    }

    window.addEventListener('resize', () => {
      setSizing()
      build()
    })
  })
}
