'use strict'

import * as preproc from './scripts/preprocess.js'
import * as viz from './scripts/viz.js'
// import * as hover from './scripts/hover.js'

/**
 * @file This file is the entry-point for the the code for the data viz project of team 10
 * @author Team 10
 * @version v1.0.0
 */

window.reloadSongs = function () {
  (function (d3) {
    let svgSize
    let graphSize
    let xScale
    let radiusScale
    let simulation
    let widthBound

    const margin = { top: 35, right: 100, bottom: 35, left: 100 }
    const radiusModulator = 2000 // the greater the value, the smaller the circles at the same window width

    d3.csv('./data_source.csv', d3.autoType).then(function (data) {
      data = preproc.filterOutRowsByValue(data, 'musiqueTitre', /son original|original sound|sonido original|suono originale|sunet original|som original/)

      data = preproc.aggregateColumns(data,
        ['vues', 'likes', 'partages', 'commentaires'],
        ['musiqueTitre']
      )

      const g = viz.generateG(margin)

      viz.appendPointG(g)
      viz.appendAxis(g)
      viz.appendCircles(data)

      widthBound = d3.select('#songs-beeswarm-plot').node().getBoundingClientRect().width

      setSizing()
      build()

      /**
       *   This function handles the graph's sizing.
       */
      function setSizing () {
        svgSize = {
          width: widthBound,
          height: 550
        }

        graphSize = {
          width: svgSize.width - margin.right - margin.left,
          height: svgSize.height - margin.bottom - margin.top
        }

        xScale = viz.setXScale(graphSize.width, data, 'vuesAverage')

        radiusScale = viz.setRadiusScale(data, svgSize.width / radiusModulator)

        viz.setCanvasSize(svgSize.width, svgSize.height)
      }

      /**
       *   This function builds the graph for the first time.
       */
      function build () {
        viz.addCoordinatesToData(data, xScale, graphSize.height / 2, 'vuesAverage')

        viz.drawXAxis(xScale, graphSize.height)

        simulation = viz.getSimulation(data, xScale, graphSize.height / 2, 'vuesAverage', radiusScale)

        viz.updateCircles(simulation, radiusScale)
      }

      /**
       *   This function rebuilds the graph after a window resize.
       */
      function rebuild () {
        viz.updateXCoordinateInData(data, xScale, 'vuesAverage')

        viz.drawXAxis(xScale, graphSize.height)

        simulation.stop()
        simulation = viz.getSimulation(data, xScale, graphSize.height / 2, 'vuesAverage', radiusScale)

        viz.updateCircles(simulation, radiusScale)

        // hover.setRectHandler(
        //   xScale,
        //   yScale,
        //   hover.rectSelected,
        //   hover.rectUnselected,
        //   hover.selectTicks,
        //   hover.unselectTicks
        // )
      }

      window.addEventListener('resize', () => {
        const newWidth = d3.select('#songs-beeswarm-plot').node().getBoundingClientRect().width
        if (newWidth !== widthBound) { // mainly to prevent the simulation from rerunning unecessarily when the height changes
          widthBound = newWidth
          setSizing()
          rebuild()
        }
      })
    })
  })(d3)
}
