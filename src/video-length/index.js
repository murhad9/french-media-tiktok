'use strict'

import * as helper from './scripts/helper.js'
import * as legend from './scripts/legend.js'
import * as preproc from './scripts/preprocess.js'
import * as viz from './scripts/viz.js'
import * as slider from '../components/slider.js'
import * as dropdown from '../components/sort-by-select.js'
import * as addons from './scripts/viz-addons.js'

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

  const colorScale = d3.scaleSequentialLog()
  const graphTitleMap = new Map()
    .set('vues', 'Average View Count per Video Length')
    .set('likes', 'Average Like Count per Video Length')
    .set('commentaires', 'Average Comment Count per Video Length')
    .set('partages', 'Average Share Count per Video Length')
  const fromToDates = {
    from: new Date(2018, 10, 30),
    to: new Date(2023, 3, 14)
  }
  const margin = { top: 100, right: 130, bottom: 80, left: 80 }

  d3.csv('./data_source.csv', d3.autoType).then(function (data) {
    const rawData = data
    let dataVideoLengthCategory = preproc.aggregateByVideoLengthInterval(data)

    slider.append(
      document.querySelector('#video-controls-time-range'),
      new Date(2018, 10, 30),
      new Date(2023, 3, 14),
      updateSelectedDates
    )

    dropdown.append(
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

    viz.initColorScale(dataVideoLengthCategory, colorScale)

    legend.initGradient(colorScale)
    legend.initLegendBar()
    legend.initLegendAxis()

    const g = helper.generateG(margin)

    helper.appendAxes(g)

    addons.initPanelDiv()

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
     * @param {object} fromToDatesParam Object with "from" and "to" properties containing Date objects
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
      dataVideoLengthCategory = preproc.aggregateByVideoLengthInterval(dataFromTo)
      build()
    }

    /**
     *   This function builds the graph.
     */
    function build () {
      viz.appendRects(dataVideoLengthCategory, graphSize.width, graphSize.height, engagementCategory, addons.displayPanel, colorScale)
      viz.generateGraphTitle(graphTitleMap.get(engagementCategory), graphSize.width)
      viz.generateGraphSubtitle(fromToDates.from, fromToDates.to, graphSize.width)
      legend.draw(svgSize.width - margin.right + 30, margin.top, graphSize.height, 15, 'url(#video-length-gradient)', colorScale)
    }

    window.addEventListener('resize', () => {
      setSizing()
      build()
    })
  })
}
