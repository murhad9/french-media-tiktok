

/**
 * Initializes the definition for the gradient to use with the
 * given colorScale.
 *
 * @param {*} colorScale The color scale to use
 */
export function initGradient (colorScale) {
  const svg = d3.select('.video-length-heatmap-svg')

  const defs = svg.append('defs')

  const linearGradient = defs
    .append('linearGradient')
    .attr('id', 'video-length-gradient')
    .attr('x1', 0)
    .attr('y1', 1)
    .attr('x2', 0)
    .attr('y2', 0)

  linearGradient
    .selectAll('stop')
    .data(
      colorScale.ticks().map((tick, i, nodes) => ({
        offset: `${100 * (i / nodes.length)}%`,
        color: colorScale(tick)
      }))
    )
    .join('stop')
    .attr('offset', (d) => d.offset)
    .attr('stop-color', (d) => d.color)
}

/**
 * Initializes the SVG rectangle for the legend.
 */
export function initLegendBar () {
  const svg = d3.select('.video-length-heatmap-svg')
  svg.append('rect').attr('class', 'legend bar')
}

/**
 *  Initializes the group for the legend's axis.
 */
export function initLegendAxis () {
  const svg = d3.select('.video-length-heatmap-svg')
  svg.append('g').attr('class', 'legend axis')
  svg.append('g').attr('class', 'legend title')
}

/**
 * Draws the legend to the left of the graphic.
 *
 * @param {number} x The x position of the legend
 * @param {number} y The y position of the legend
 * @param {number} height The height of the legend
 * @param {number} width The width of the legend
 * @param {string} fill The fill of the legend
 * @param {*} colorScale The color scale represented by the legend
 */
export function draw (x, y, height, width, fill, colorScale, tableau) {

  d3.select('.video-length-heatmap-svg .legend.axis')
    .selectAll('text')
    .remove()

  d3.select('.video-length-heatmap-svg .legend.title')
    .selectAll('text')
    .remove()

  d3.select('.video-length-heatmap-svg .legend.title')
    .append('text')
    .style('font', '12px sans-serif')
    .style('fill', '#ccc')
    .attr('transform', `translate(${x - 25},${y -30})`)
    .text('videos count')

    
  


  d3.select('.video-length-heatmap-svg .legend.bar')
    .attr('x', x)
    .attr('y', y - 5)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', fill)



  const ticks = tableau
  d3.select('.video-length-heatmap-svg .legend.axis')
    .selectAll('text')
    .data(ticks)
    .enter()
    .append('text')
    .style('font', '10px sans-serif')
    .style('fill', '#ccc')
    .attr('transform', `translate(${x -10},0)`)

    .attr('text-anchor', 'end')
    .attr('y', function (d, i) {
      return ((ticks.length - 1) - i) * (height / (ticks.length - 1)) + y
    })
    .text(function (d, i) {
     return d
    })
  


    
    
}
/**
 * Updates the legend
 *
 * @param {number} x The x position of the legend
 * @param {number} y The y position of the legend
 * @param {number} height The height of the legend
 * @param {*} colorScale The color scale represented by the legend
 */
export function update (x, y, height, colorScale) {
  const ticks = colorScale.ticks()

  // Remove existing ticks
  d3.select('.video-length-heatmap-svg .legend.axis')
    .selectAll('text')
    .remove()

  // Append new ticks
  d3.select('.video-length-heatmap-svg .legend.axis')
    .selectAll('text')
    .data(ticks)
    .enter()
    .append('text')
    .style('font', '10px sans-serif')
    .style('fill', '#ccc')
    .attr('x', function (d, i) {
      return x - 10
    })
    .attr('text-anchor', 'end')
    .attr('y', function (d, i) {
      return ((ticks.length - 1) - i) * (height / (ticks.length - 1)) + y
    })
    .text(function (d, i) {
      if (i % 2 === 0) {
        if (d >= 1000) return Math.floor((d / 1000)) + ',' + (d % 1000).toString().padStart(3, '0')
        return d
      }
    })
}

