'use strict'

import * as helper from './scripts/helper.js'
import * as preproc from './scripts/preprocess.js'
import * as viz from './scripts/viz.js'
import * as legend from './scripts/legend.js'
import * as hover from './scripts/hover.js'

import * as d3Chromatic from 'd3-scale-chromatic'

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
    // TODO: Use this file for welcom vizs
    const xScale = d3.scaleBand().padding(0.05)
    const yScale = d3.scaleBand().padding(0.2)
    const colorScale = d3.scaleSequential(d3Chromatic.interpolateBuPu)

    d3.csv('./data_source.csv', d3.autoType).then(function (data) {
      // These are just examples

      // For song analysis
      preproc.sumEngagementByColumn(data, 'musiqueTitre')
      preproc.sumEngagementByColumn(data, 'musiqueArtiste')

      data = preproc.addTimeBlocks(preproc.processDateTime(data))
      data = preproc.aggregateColumns(
        data,
        ['vues', 'likes', 'partages', 'commentaires'],
        ['dayOfWeek', 'timeBlock']
      )
      data = preproc.sortByColumns(
        data,
        ['averageVues', 'vues', 'likes', 'partages', 'commentaires'],
        true
      )
      data = preproc.normalizeColumn(data, 'vuesAverage')
      viz.setColorScaleDomain(colorScale, data, 'vuesAverageNormalized')

      legend.initGradient(colorScale)
      legend.initLegendBar()
      legend.initLegendAxis()

      const g = helper.generateG(margin)

      helper.appendAxes(g)
      viz.appendRects(data)

      setSizing()
      build()

      /**
       *   This function handles the graph's sizing.
       */
      function setSizing () {
        bounds = d3.select('.songs-graph').node().getBoundingClientRect()

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
       *   This function builds the graph.
       */
      function build () {
        viz.updateXScale(xScale, graphSize.width)
        viz.updateYScale(
          yScale,
          preproc.getUniqueTimeBlocks(data),
          graphSize.height
        )

        viz.drawXAxis(xScale)
        viz.drawYAxis(yScale, graphSize.width)

        viz.rotateYTicks()

        viz.updateRects(xScale, yScale, colorScale)

        hover.setRectHandler(
          xScale,
          yScale,
          hover.rectSelected,
          hover.rectUnselected,
          hover.selectTicks,
          hover.unselectTicks
        )

        legend.draw(
          margin.left / 2,
          margin.top + 5,
          graphSize.height - 10,
          15,
          'url(#gradient)',
          colorScale
        )
      }

      window.addEventListener('resize', () => {
        setSizing()
        build()
      })
    })
  })(d3)
}
