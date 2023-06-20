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
  let widthBound
  let nonAggregatedData
  let timeBoundData
  let domainColumn = 'vuesAverage' // by default, display songs according to average views
  const graphTitleMap = new Map()
    .set('vuesAverage', 'Songs Used in TikTok Videos by Average View Count')
    .set('likesAverage', 'Songs Used in TikTok Videos by Average Like Count')
    .set('commentairesAverage', 'Songs Used in TikTok Videos by Average Comment Count')
    .set('partagesAverage', 'Songs Used in TikTok Videos by Average Share Count')

  const margin = { top: 35, right: 400, bottom: 35, left: 50 }
  const radiusModulator = 1600 // the greater the value, the smaller the circles at the same window width

  d3.csv('./data_source.csv', d3.autoType).then(function (data) {
    data = preproc.filterOutRowsByValue(
      data,
      'musiqueTitre',
      /son original|original sound|sonido original|suono originale|sunet original|som original/
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

    widthBound = d3
      .select('#songs-beeswarm-plot')
      .node()
      .getBoundingClientRect().width

    viz.generateGraphTitle(graphTitleMap.get(domainColumn), widthBound - margin.left)

    addons.initPanelDiv()

    setSizing()
    initControlPanel()
    build()

    /**
     *   This function handles the graph's sizing.
     */
    function setSizing () {
      svgSize = {
        width: widthBound,
        height: 400
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

      viz.addCoordinatesToData(data, xScale, graphSize.height / 2, domainColumn)

      viz.drawXAxis(xScale, graphSize.width, graphSize.height, domainColumn)

      simulation = viz.getSimulation(
        timeBoundData,
        xScale,
        graphSize.height / 2,
        domainColumn,
        radiusScale
      )

      viz.updateCircles(data, simulation, radiusScale, addons.displayPanel)
    }

    /**
     *   This function rebuilds the graph after a window resize or when the date range slider changes.
     */
    function rebuild () {
      xScale = viz.setXScale(graphSize.width, data, domainColumn)

      viz.updateXCoordinateInData(timeBoundData, xScale, domainColumn)

      viz.drawXAxis(xScale, graphSize.width, graphSize.height, domainColumn)

      viz.generateGraphTitle(graphTitleMap.get(domainColumn), graphSize.width + margin.right)

      simulation.stop()
      simulation = viz.getSimulation(
        timeBoundData,
        xScale,
        graphSize.height / 2,
        domainColumn,
        radiusScale
      )

      viz.updateCircles(timeBoundData, simulation, radiusScale, addons.displayPanel)
    }

    /**
     * This function initialises the control panel by adding the dropdown and the slider.
     */
    function initControlPanel () {
      // Dropdown
      d3.select('#songs .songs-dropdown')
        .append('div')
        .style('color', 'white')
        .style('font-size', '24px')
        .style('font-weight', 'bold')
        .style('margin-left', '20%')
        .style('margin-bottom', '10px')
        .text('Sort by')

      dropdown.append(
        document.querySelector('#songs .songs-dropdown'),
        { 'Average Views': 'vuesAverage', 'Average Likes': 'likesAverage', 'Average Comments': 'commentairesAverage', 'Average Shares': 'partagesAverage' },
        updateDomainColumn
      )

      // Slider
      d3.select('#songs .songs-slider')
        .append('div')
        .style('color', 'white')
        .style('font-size', '24px')
        .style('font-weight', 'bold')
        .style('margin-left', '35%')
        .style('margin-bottom', '10px')
        .text('Time range')

      const minDate = d3.min(nonAggregatedData, row => new Date(row.date))
      const maxDate = d3.max(nonAggregatedData, row => new Date(row.date))
      slider.append(document.querySelector('#songs .songs-slider'), minDate, maxDate, updateTimeRange)
    }

    /**
     * Callback function to update the column used for the x axis
     *
     * @param {string} column The new column to use
     */
    function updateDomainColumn (column) {
      domainColumn = column
      rebuild()
    }

    /**
     * Updates the time range for the upload dates of the data
     *
     * @param {*} range Object with "from" and "to" properties containing Date objects
     */
    function updateTimeRange (range) {
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
      const newWidth = d3
        .select('#songs-beeswarm-plot')
        .node()
        .getBoundingClientRect().width
      if (newWidth !== widthBound) {
        // mainly to prevent the simulation from rerunning unecessarily when the height changes
        widthBound = newWidth
        setSizing()
        rebuild()
      }
    })
  })
}
