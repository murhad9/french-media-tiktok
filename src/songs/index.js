'use strict'

import * as preproc from './scripts/preprocess.js'
import * as viz from './scripts/viz.js'
import * as addons from './scripts/viz-addons.js'
import * as slider from '../components/slider.js'
import * as dropdown from '../components/sort-by-select.js'

/**
 * Loads the songs tab.
 *
 * @param {*} d3 The d3 library
 */
export function load (d3) {
  let svgSize
  let graphSize
  let xScale
  let radiusScale
  let simulation
  let nonAggregatedData
  let timeBoundData
  let minDate
  let maxDate
  let domainColumn = 'vuesAverage' // by default, display songs according to average views

  const graphTitleMap = new Map()
    .set('vuesAverage', 'Songs Used in TikTok Videos by Average View Count')
    .set('likesAverage', 'Songs Used in TikTok Videos by Average Like Count')
    .set('commentairesAverage', 'Songs Used in TikTok Videos by Average Comment Count')
    .set('partagesAverage', 'Songs Used in TikTok Videos by Average Share Count')
  const axisTitleMap = new Map()
    .set('vuesAverage', 'Average Views')
    .set('likesAverage', 'Average Likes')
    .set('commentairesAverage', 'Average Comments')
    .set('partagesAverage', 'Average Shares')
  const margin = { top: 80, right: 100, bottom: 80, left: 100 }
  const radiusModulator = 1100 // the greater the value, the smaller the circles at the same window width
  const yPositionFactor = 1.1 // the greater the value, the lower the circles

  d3.csv('./data_source.csv', d3.autoType).then(function (data) {
    data = preproc.filterOutRowsByValue(
      data,
      'musiqueTitre',
      /son original|original sound|sonido original|suono originale|sunet original|som original|오리지널 사운드/
    )

    nonAggregatedData = data

    data = preproc.aggregateColumns(
      data,
      ['vues', 'likes', 'partages', 'commentaires'],
      ['média'],
      ['musiqueTitre', 'musiqueArtiste']
    )

    timeBoundData = data

    const g = viz.generateG(margin)

    viz.appendPointG(g)
    viz.appendAxis(g)
    viz.appendGraphLabel(g)

    minDate = d3.min(nonAggregatedData, row => new Date(row.date))
    maxDate = d3.max(nonAggregatedData, row => new Date(row.date))
    addons.initPanelDiv()
    addons.initDropdown(dropdown, updateDomainColumn)
    addons.initSlider(slider, minDate, maxDate, updateTimeRange)

    setSizing()
    build()

    /**
     *   This function handles the graph's sizing.
     */
    function setSizing () {
      svgSize = {
        width: d3.select('#songs-beeswarm-plot')
          .node()
          .getBoundingClientRect().width,
        height: d3.select('#songs-beeswarm-plot')
          .node()
          .getBoundingClientRect().height
      }

      graphSize = {
        width: svgSize.width - margin.right - margin.left,
        height: svgSize.height - margin.bottom - margin.top
      }

      radiusScale = viz.setRadiusScale(data, svgSize.width / radiusModulator)

      viz.setCanvasSize(svgSize.width, svgSize.height)
    }

    /**
     *   This function builds the graph for the first time.
     */
    function build () {
      xScale = viz.setXScale(graphSize.width, data, domainColumn)

      viz.addCoordinatesToData(data, xScale, graphSize.height / 2 * yPositionFactor, domainColumn)

      viz.drawXAxis(xScale, graphSize.width, graphSize.height, axisTitleMap.get(domainColumn))

      viz.generateGraphTitle(graphTitleMap.get(domainColumn), graphSize.width)
      viz.generateGraphSubtitle(minDate, maxDate, graphSize.width)

      simulation = viz.getSimulation(
        timeBoundData,
        xScale,
        graphSize.height / 2 * yPositionFactor,
        domainColumn,
        radiusScale
      )

      viz.updateCircles(data, simulation, radiusScale, addons.displayPanel)
    }

    /**
     * This function rebuilds the graph after a window resize or when the date range slider changes.
     *
     * @param {boolean} resetY Whether or not to reset the y position of the circles
     */
    function rebuild (resetY = false) {
      xScale = viz.setXScale(graphSize.width, data, domainColumn)

      if (resetY) {
        viz.addCoordinatesToData(timeBoundData, xScale, graphSize.height / 2 * yPositionFactor, domainColumn)
      } else {
        viz.updateXCoordinateInData(timeBoundData, xScale, domainColumn)
      }

      viz.drawXAxis(xScale, graphSize.width, graphSize.height, axisTitleMap.get(domainColumn))

      viz.generateGraphTitle(graphTitleMap.get(domainColumn), graphSize.width)
      viz.generateGraphSubtitle(minDate, maxDate, graphSize.width)

      simulation.stop()
      simulation = viz.getSimulation(
        timeBoundData,
        xScale,
        graphSize.height / 2 * yPositionFactor,
        domainColumn,
        radiusScale
      )

      viz.updateCircles(timeBoundData, simulation, radiusScale, addons.displayPanel)
    }

    /**
     * Callback function to update the column used for the x axis
     *
     * @param {string} column The new column to use
     */
    function updateDomainColumn (column) {
      d3.select('#songs-graph-g .points .selected').classed('selected', false)
      domainColumn = column
      rebuild()
    }

    /**
     * Updates the time range for the upload dates of the data
     *
     * @param {*} range Object with "from" and "to" properties containing Date objects
     */
    function updateTimeRange (range) {
      minDate = range.from
      maxDate = range.to

      const oldCoordinates = saveCoordinates()
      aggregateFilteredData(range)
      applyCoordinatesToData(oldCoordinates)
      rebuild()

      /**
       * Saves previous coordinates of timeBoundData into a map.
       *
       * @returns {Map} The map containing the saved coordinates
       */
      function saveCoordinates () {
        return new Map(timeBoundData.map(song => {
          const fullSong = song.musiqueTitre.concat(song.musiqueArtiste)
          const coordinates = { x: song.x, y: song.y }
          return [fullSong, coordinates]
        }))
      }

      /**
       * Aggregates the data again with the new date range as a filter.
       *
       * @param {*} range Object with "from" and "to" properties containing Date objects
       */
      function aggregateFilteredData (range) {
        timeBoundData = nonAggregatedData.filter(row => {
          const uploadTime = new Date(row.date).getTime()
          return range.from.getTime() <= uploadTime && uploadTime <= range.to.getTime()
        })
        timeBoundData = preproc.aggregateColumns(
          timeBoundData,
          ['vues', 'likes', 'partages', 'commentaires'],
          ['média'],
          ['musiqueTitre', 'musiqueArtiste']
        )
      }

      /**
       * Applies coordinates to the new timeBoundData. This is necessary to prevent the position of the points
       * from resetting every time the state of the time range slider changes.
       *
       * @param {Map} coordinates The coordinates to apply to each song's data point
       */
      function applyCoordinatesToData (coordinates) {
        timeBoundData.forEach(song => {
          const fullSong = song.musiqueTitre.concat(song.musiqueArtiste)
          const songCoordinates = coordinates.get(fullSong)
          if (songCoordinates) {
            song.x = songCoordinates.x
            song.y = songCoordinates.y
          } else {
            song.y = graphSize.height / 2
          }
        })
      }
    }

    window.addEventListener('resize', () => {
      setSizing()
      rebuild(true)
    })
  })
}
