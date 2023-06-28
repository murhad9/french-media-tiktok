import d3Legend from 'd3-svg-legend'

/**
 * Appends the legend to the visualization.
 *
 * @param {*} g The g element to append the legend to
 */
export function appendLegend (g) {
  g.append('g').attr('class', 'legend')
}

/**
 * Draws the legend.
 * For documentation, see : https://d3-legend.susielu.com/
 *
 * @param {number} xPosition The x position of the legend
 * @param {number} yPosition The y position of the legend
 * @param {*} rScale The scale used for the radius of the circles
 */
export function drawLegend (xPosition, yPosition, rScale) {
  const g = d3.select('#songs-graph-g .legend').attr('transform', `translate(${xPosition},${yPosition})`)

  g.selectAll('*').remove()

  const legendGenerator = d3Legend.legendSize()
    .scale(rScale)
    .shape('circle')
    .shapePadding(8)
    .labelFormat(d3.format('d'))
    .labelOffset(8)

  g.call(legendGenerator)

  g.append('text')
    .style('font', '10px sans-serif')
    .style('fill', '#fff')
    .attr('y', -20)
    .attr('text-anchor', 'middle')
    .text('Video Count')

  g.selectAll('.swatch')
    .attr('fill', '#6a4270')

  g.selectAll('.label')
    .attr('fill', 'rgb(199,199,199)')
}
