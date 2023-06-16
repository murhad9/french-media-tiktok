'use strict'

import * as preproc from './scripts/preprocess.js'
import * as viz from './scripts/viz.js'
import * as addons from './scripts/viz-addons.js'
// import * as slider from '../components/slider.js'

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
  let domainColumn = 'vuesAverage' // by default, display songs according to average views

  const margin = { top: 35, right: 400, bottom: 35, left: 50 }
  const radiusModulator = 1600 // the greater the value, the smaller the circles at the same window width

  // slider.append(document.querySelector('#songs .viz-container'), new Date(2018, 10, 30), new Date(2023, 3, 14), () => {})

  d3.csv('./data_source.csv', d3.autoType).then(function (data) {
    data = preproc.filterOutRowsByValue(
      data,
      'musiqueTitre',
      /son original|original sound|sonido original|suono originale|sunet original|som original/
    )

    data = preproc.aggregateColumns(
      data,
      ['vues', 'likes', 'partages', 'commentaires'],
      ['média'],
      ['musiqueTitre', 'musiqueArtiste']
    )

    const g = viz.generateG(margin)

    viz.appendPointG(g)
    viz.appendAxis(g)
    viz.appendGraphLabel(g)
    viz.appendCircles(data)

    widthBound = d3
      .select('#songs-beeswarm-plot')
      .node()
      .getBoundingClientRect().width

    addons.initPanelDiv()
    addons.initButtons(updateDomainColumn)

    setSizing()
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

      viz.addCoordinatesToData(
        data,
        xScale,
        graphSize.height / 2,
        domainColumn
      )

      viz.drawXAxis(xScale, graphSize.width, graphSize.height, domainColumn)

      simulation = viz.getSimulation(
        data,
        xScale,
        graphSize.height / 2,
        domainColumn,
        radiusScale
      )

      viz.updateCircles(simulation, radiusScale, addons.displayPanel)
    }

    /**
     *   This function rebuilds the graph after a window resize.
     */
    function rebuild () {
      xScale = viz.setXScale(graphSize.width, data, domainColumn)

      viz.updateXCoordinateInData(data, xScale, domainColumn)

      viz.drawXAxis(xScale, graphSize.width, graphSize.height, domainColumn)

      simulation.stop()
      simulation = viz.getSimulation(
        data,
        xScale,
        graphSize.height / 2,
        domainColumn,
        radiusScale
      )

      viz.updateCircles(simulation, radiusScale, addons.displayPanel)
    }

    /**
     * Callback function to update the column used for the x axis
     *
     * @param {*} column The new column to use
     */
    function updateDomainColumn (column) {
      domainColumn = column
      rebuild()
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
