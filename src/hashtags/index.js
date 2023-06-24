'use strict'

import * as helper from './scripts/helper.js'
import * as preproc from './scripts/preprocess.js'
import * as viz from './scripts/viz.js'
import * as slider from '../components/slider.js'
import * as sortBySelect from '../components/sort-by-select.js'

import d3Tip from 'd3-tip'

/**
 * Loads the video length tab.
 *
 * @param {*} d3 The d3 library
 */
export function load (d3) {
  let bounds
  let svgSize
  let engagementCategory = 'vues'
  const graphTitleMap = new Map()
    .set('vues', 'The 10 Most Popular Hashtags by Average View Count')
    .set('likes', 'The 10 Most Popular Hashtags by Average Like Count')
    .set('commentaires', 'The 10 Most Popular Hashtags by Average Comment Count')
    .set('partages', 'The 10 Most Popular Hashtags by Average Share Count')
  const fromToDates = {
    from: new Date(2018, 10, 30),
    to: new Date(2023, 3, 14)
  }
  const yScale = d3.scaleLinear()
  // eslint-disable-next-line no-unused-vars
  let graphSize

  const tip = d3Tip().attr('class', 'd3-tip').html(function (d) {
    return helper.getContents(d, engagementCategory)
  })
  d3.select('.hashtags-heatmap-svg').call(tip)

  const margin = { top: 35, right: 60, bottom: 120, left: 100 }

  d3.csv('./data_source.csv', d3.autoType).then(function (csvData) {
    const g = helper.generateG(margin)
    let data = preproc.regrouperParHashtags(csvData, fromToDates).sort((a, b) => b[engagementCategory] - a[engagementCategory]).slice(0, 10)
    slider.append(
      document.querySelector('#hashtags-controls-time-range'),
      new Date(2018, 10, 30),
      new Date(2023, 3, 14),
      updateSelectedDates
    )

    sortBySelect.append(
      document.querySelector('#hashtags-controls-sort-by'),
      {
        'Average Views': 'vues',
        'Average Likes': 'likes',
        'Average Comments': 'commentaires',
        'Average Shares': 'partages'
      },
      updateDomainColumn
    )

    helper.appendAxes(g)
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

    /**
     * This function builds the graph.
     */
    function build () {
      data = preproc.regrouperParHashtags(csvData, fromToDates).sort((a, b) => b[engagementCategory] - a[engagementCategory]).slice(0, 10)
      viz.generateGraphTitle(graphTitleMap.get(engagementCategory), graphSize.width)
      viz.generateGraphSubtitle(fromToDates.from, fromToDates.to, graphSize.width)
      viz.updateYScale(yScale, data, graphSize.height, engagementCategory)
      viz.appendRects(data, graphSize.width, graphSize.height, engagementCategory, tip, yScale)
    }

    /**
     * Updates the plot with the select date range
     *
     * @param {*} fromToDatesParam Object with "from" and "to" properties containing Date objects
     */
    function updateSelectedDates (fromToDatesParam) {
      fromToDates.from = fromToDatesParam.from
      fromToDates.to = fromToDatesParam.to
      const g = helper.generateG(margin)
      helper.appendAxes(g)
      setSizing()
      build(false)
    }

    /**
     * Callback function to update the column used for the x axis
     *
     * @param {*} column The new column to use
     */
    function updateDomainColumn (column) {
      engagementCategory = column
      const g = helper.generateG(margin)
      helper.appendAxes(g)
      setSizing()
      build()
    }

    window.addEventListener('resize', () => {
      setSizing()
      build()
    })
  })
}
