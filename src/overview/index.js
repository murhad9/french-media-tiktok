'use strict'

import * as helper from './scripts/helper.js'
import * as menu from '../components/media-selection-menu.js'
import * as preproc from './scripts/preprocess.js'
import * as viz from './scripts/viz.js'
import * as addons from './scripts/viz-addons.js'
import * as slider from '../components/slider.js'
import * as sortBySelect from '../components/sort-by-select.js'

/**
 * Loads the overview tab.
 *
 * @param {*} d3 The d3 library
 */
export function load (d3) {
  let bounds
  let svgSize
  let graphSize
  let yScale
  let domainColumn = 'vues'
  let selectedMediaList = []

  const graphTitleMap = new Map()
    .set('vues', 'Total Monthly View Count of Various Media Outlets')
    .set('likes', 'Total Monthly Like Count of Various Media Outlets')
    .set('commentaires', 'Total Monthly Comment Count of Various Media Outlets')
    .set('partages', 'Total Monthly Share Count of Various Media Outlets')
  const fromTo = { from: new Date(2018, 10, 30), to: new Date(2023, 3, 14) }
  const margin = { top: 30, right: 70, bottom: 80, left: 70 }
  const xScale = d3.scaleTime()

  d3.csv('./data_source.csv', d3.autoType).then(function (data) {
    // removes video in april 2023 because the month is not entirely covered in input data
    data = preproc.removeAfter(data, new Date('2023-03-30'))
    data = preproc.setYear(data)
    const mediaList = preproc.getMediaList(data)

    selectedMediaList = mediaList // display all media outlets by default

    // creates the media selection component
    menu.append(
      document.querySelector('#overview-controls-media-selection'),
      mediaList,
      updateSelectedMedia
    )

    slider.append(
      document.querySelector('#overview-controls-time-range'),
      new Date(2018, 10, 30),
      new Date(2023, 3, 14),
      updateSelectedDates
    )

    sortBySelect.append(
      document.querySelector('#overview-controls-sort-by'),
      {
        'Total Views': 'vues',
        'Total Likes': 'likes',
        'Total Comments': 'commentaires',
        'Total Shares': 'partages'
      },
      updateDomainColumn
    )

    data = data.map((row) => {
      return {
        ...row,
        yearMonth: row.year + '>' + new Date(row.date).getMonth()
      }
    })
    data = preproc.aggregateColumns(
      data,
      ['vues', 'likes', 'partages', 'commentaires'],
      ['date'],
      ['yearMonth', 'média']
    )
    preproc.normalizeDates(data)

    let dataFromTo = data

    const g = helper.generateG(margin)

    helper.appendAxes(g)
    helper.appendPointG(g)

    addons.initPanelDiv()

    setSizing()
    build()

    /**
     *   This function handles the graph's sizing.
     */
    function setSizing () {
      bounds = d3.select('.overview-graph').node().getBoundingClientRect()

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
     * Callback function to update the column used for the x axis
     *
     * @param {*} column The new column to use
     */
    function updateDomainColumn (column) {
      domainColumn = column
      build()
    }

    /**
     * Updates the plot with the selected media
     *
     * @param {string[]} mediaList The selected media
     */
    function updateSelectedMedia (mediaList) {
      selectedMediaList = mediaList
      build(false)
    }

    /**
     * Updates the plot with the select date range
     *
     * @param {*} fromToDates Object with "from" and "to" properties containing Date objects
     */
    function updateSelectedDates (fromToDates) {
      fromTo.from = fromToDates.from
      fromTo.to = fromToDates.to
      dataFromTo = data
      dataFromTo = dataFromTo.filter((row) => {
        return (
          new Date(row.date).getTime() >= fromToDates.from.getTime() &&
          new Date(row.date).getTime() <= fromToDates.to.getTime()
        )
      })
      build(false)
    }

    /**
     * This function builds the graph.
     *
     * @param {boolean} updateYScale Whether or not the y scale should be updated
     */
    function build (updateYScale = true) {
      viz.updateXScale(dataFromTo, xScale, graphSize.width)
      if (updateYScale) {
        yScale = viz.setYScale(dataFromTo, graphSize.height, domainColumn)
      }

      viz.drawXAxis(xScale, graphSize.height)
      viz.drawYAxis(yScale)

      viz.generateGraphTitle(graphTitleMap.get(domainColumn), graphSize.width)
      viz.generateGraphSubtitle(fromTo.from, fromTo.to, graphSize.width)

      viz.updateLines(
        xScale,
        yScale,
        dataFromTo,
        domainColumn,
        addons.displayPanel,
        selectedMediaList
      )
    }

    window.addEventListener('resize', () => {
      setSizing()
      build()
    })
  })
}
