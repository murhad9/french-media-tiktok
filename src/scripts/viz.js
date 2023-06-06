
/**
 * Sets the domain of the color scale
 *
 * @param {*} colorScale The color scale used in the heatmap
 * @param {object[]} data The data to be displayed
 */
export function setColorScaleDomain (colorScale, data) {
  // TODO : Set domain of color scale
  const counts = data.map(entry => entry.Counts)
  colorScale.domain(d3.extent(counts))
}

/**
 * For each data element, appends a group 'g' to which an SVG rect is appended
 *
 * @param {object[]} data The data to use for binding
 */
export function appendRects (data) {
  // TODO : Append SVG rect elements
  d3.select('#graph-g')
    .selectAll('g.cell')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'cell')
    .append('rect')
}

/**
 * Updates the domain and range of the scale for the x axis
 *
 * @param {*} xScale The scale for the x axis
 * @param {object[]} data The data to be used
 * @param {number} width The width of the diagram
 * @param {Function} range A utilitary funtion that could be useful to generate a list of numbers in a range
 */
export function updateXScale (xScale, data, width, range) {
  // TODO : Update X scale
  const yearDomain = range(d3.min(data, entry => entry.Plantation_Year), d3.max(data, entry => entry.Plantation_Year))
  xScale.domain(yearDomain).range([0, width])
}

/**
 * Updates the domain and range of the scale for the y axis
 *
 * @param {*} yScale The scale for the y axis
 * @param {string[]} neighborhoodNames The names of the neighborhoods
 * @param {number} height The height of the diagram
 */
export function updateYScale (yScale, neighborhoodNames, height) {
  // TODO : Update Y scale
  const sortedNeighborhoods = neighborhoodNames.sort()
  yScale.domain(sortedNeighborhoods).range([0, height])
}

/**
 *  Draws the X axis at the top of the diagram.
 *
 *  @param {*} xScale The scale to use to draw the axis
 */
export function drawXAxis (xScale) {
  // TODO : Draw X axis
  const xAxisGenerator = d3.axisTop().scale(xScale)
  d3.select('#graph-g .x')
    .call(xAxisGenerator)
}

/**
 * Draws the Y axis to the right of the diagram.
 *
 * @param {*} yScale The scale to use to draw the axis
 * @param {number} width The width of the graphic
 */
export function drawYAxis (yScale, width) {
  // TODO : Draw Y axis
  const yAxisGenerator = d3.axisRight().scale(yScale)
  d3.select('#graph-g .y')
    .attr('transform', `translate(${width},0)`)
    .call(yAxisGenerator)
}

/**
 * Rotates the ticks on the Y axis 30 degrees towards the left.
 */
export function rotateYTicks () {
  // TODO : Rotate Y ticks.
  d3.selectAll('#graph-g .y .tick').attr('transform', function () {
    return d3.select(this).attr('transform') + ` rotate(${-30})`
  })
}

/**
 * After the rectangles have been appended, this function dictates
 * their position, size and fill color.
 *
 * @param {*} xScale The x scale used to position the rectangles
 * @param {*} yScale The y scale used to position the rectangles
 * @param {*} colorScale The color scale used to set the rectangles' colors
 */
export function updateRects (xScale, yScale, colorScale) {
  // TODO : Set position, size and fill of rectangles according to bound data
  d3.selectAll('#graph-g .cell')
    .attr('transform', d => `translate(${xScale(d.Plantation_Year)},${yScale(d.Arrond_Nom)})`)
    .select('rect')
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('fill', d => colorScale(d.Counts))
}
