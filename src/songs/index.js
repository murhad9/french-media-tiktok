'use strict'

import * as preproc from './scripts/preprocess.js'
import * as viz from './scripts/viz.js'
// import * as legend from './scripts/legend.js'
// import * as hover from './scripts/hover.js'

// import * as d3Chromatic from 'd3-scale-chromatic'

/**
 * @file This file is the entry-point for the the code for the data viz project of team 10
 * @author Team 10
 * @version v1.0.0
 */

window.reloadSongs = function () {
  (function (d3) {
    let bounds
    let svgSize
    let graphSize

    const margin = { top: 35, right: 200, bottom: 35, left: 200 }

    d3.csv('./data_source.csv', d3.autoType).then(function (data) {
      data = preproc.filterOutRowsByValue(data, 'musiqueTitre', /son original|original sound|sonido original|suono originale|sunet original|som original/)

      data = preproc.aggregateColumns(data,
        ['vues', 'likes', 'partages', 'commentaires'],
        ['musiqueTitre']
      )

      console.log(data)

      setSizing()

      // legend.initGradient(colorScale)
      // legend.initLegendBar()
      // legend.initLegendAxis()

      const g = viz.generateG(margin)

      viz.appendPointG(g)
      viz.appendAxis(g)
      viz.appendCircles(data, graphSize.height / 2)

      build()

      /**
       *   This function handles the graph's sizing.
       */
      function setSizing () {
        bounds = d3.select('#songs-beeswarm-plot').node().getBoundingClientRect()

        svgSize = {
          width: bounds.width,
          height: 550
        }

        graphSize = {
          width: svgSize.width - margin.right - margin.left,
          height: svgSize.height - margin.bottom - margin.top
        }

        viz.setCanvasSize(svgSize.width, svgSize.height)
      }

      /**
       *   This function builds the graph.
       */
      function build () {
        const xScale = viz.setXScale(graphSize.width, data, 'vuesAverage')

        viz.drawXAxis(xScale, graphSize.height)
        viz.updateCircles(xScale, 'vuesAverage')

        // hover.setRectHandler(
        //   xScale,
        //   yScale,
        //   hover.rectSelected,
        //   hover.rectUnselected,
        //   hover.selectTicks,
        //   hover.unselectTicks
        // )

        // legend.draw(
        //   margin.left / 2,
        //   margin.top + 5,
        //   graphSize.height - 10,
        //   15,
        //   'url(#gradient)',
        //   colorScale
        // )
      }

      window.addEventListener('resize', () => {
        setSizing()
        build()
      })
    })
  })(d3)
}
