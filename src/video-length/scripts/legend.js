/**
 * Initializes the definition for the gradient to use with the
 * given colorScale.
 *
 * @param {*} colorScale The color scale to use
 */
export function initGradient (colorScale) {
  const svg = d3.select('.video-length-svg')

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
    .data(colorScale.ticks().map((tick, i, nodes) => ({
      offset: `${100 * (i / nodes.length)}%`,
      color: colorScale(tick)
    })))
    .join('stop')
    .attr('offset', (d) => d.offset)
    .attr('stop-color', (d) => d.color)
}

/**
 * Initializes the SVG rectangle for the legend.
 */
export function initLegendBar () {
  const svg = d3.select('.video-length-svg')
  svg.append('rect').attr('class', 'legend bar')
}

/**
 *  Initializes the group for the legend's axis.
 */
export function initLegendAxis () {
  const svg = d3.select('.video-length-svg')
  svg.append('g').attr('class', 'legend axis')
}

/**
 * Draws the legend to the right of the histogram.
 *
 * @param {number} x The x position of the legend
 * @param {number} y The y position of the legend
 * @param {number} height The height of the legend
 * @param {number} width The width of the legend
 * @param {string} fill The fill of the legend
 * @param {*} colorScale The color scale represented by the legend
 */
export function draw (x, y, height, width, fill, colorScale) {
  d3.select('.video-length-svg .legend.bar')
    .attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', fill)

  const ticks = colorScale.ticks()
  d3.select('.video-length-svg .legend.axis')
    .selectAll('text')
    .data(ticks)
    .join('text')
    .style('font', '10px sans-serif')
    .style('fill', '#ccc')
    .attr('x', x + 25)
    .attr('text-anchor', 'start')
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
