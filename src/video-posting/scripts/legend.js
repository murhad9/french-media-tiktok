/**
 * Initializes the definition for the gradient to use with the
 * given colorScale.
 *
 * @param {*} colorScale The color scale to use
 */
export function initGradient (colorScale) {
  const svg = d3.select('.video-posting-heatmap-svg')

  const defs = svg.append('defs')

  const linearGradient = defs
    .append('linearGradient')
    .attr('id', 'video-posting-gradient')
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
  const svg = d3.select('.video-posting-heatmap-svg')
  svg.append('rect').attr('class', 'legend bar')
}

/**
 *  Initializes the group for the legend's axis.
 */
export function initLegendAxis () {
  const svg = d3.select('.video-posting-heatmap-svg')
  svg.append('g').attr('class', 'legend axis')
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
export function draw (x, y, height, width, fill, colorScale) {
  d3.select('.video-posting-heatmap-svg .legend.bar')
    .attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', fill)

  const ticks = colorScale.ticks()
  d3.select('.video-posting-heatmap-svg .legend.axis')
    .selectAll('text')
    .data(ticks)
    .enter()
    .append('text')
    .style('font', '10px sans-serif')
    .style('fill', '#777')
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
