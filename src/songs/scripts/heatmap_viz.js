/**
 * Sets the domain of the color scale
 *
 * @param {*} colorScale The color scale used in the heatmap
 * @param {object[]} data The data to be displayed
 * @param {string} targetColumn The column to use as domain
 */
export function setColorScaleDomain (colorScale, data, targetColumn) {
  const averageViews = data.map((entry) => entry[targetColumn])
  colorScale.domain(d3.extent(averageViews))
}

/**
 * For each data element, appends a group 'g' to which an SVG rect is appended
 *
 * @param {object[]} data The data to use for binding
 */
export function appendRects (data) {
  // TODO : Append SVG rect elements
  d3.select('#songs-graph-g')
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
 * @param {number} width The width of the diagram
 */
export function updateXScale (xScale, width) {
  const daysOfWeekDomain = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]
  xScale.domain(daysOfWeekDomain).range([0, width])
}

/**
 * Updates the domain and range of the scale for the y axis
 *
 * @param {*} yScale The scale for the y axis
 * @param {object[]} timeBlocks The names of the neighborhoods
 * @param {number} height The height of the diagram
 */
export function updateYScale (yScale, timeBlocks, height) {
  const sortedTimeBlocks = timeBlocks.sort()
  yScale.domain(sortedTimeBlocks).range([0, height])
}

/**
 *  Draws the X axis at the top of the diagram.
 *
 *  @param {*} xScale The scale to use to draw the axis
 */
export function drawXAxis (xScale) {
  // TODO : Draw X axis
  const xAxisGenerator = d3.axisTop().scale(xScale)
  d3.select('#songs-graph-g .x').call(xAxisGenerator)
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
  d3.select('#songs-graph-g .y')
    .attr('transform', `translate(${width},0)`)
    .call(yAxisGenerator)
}

/**
 * Rotates the ticks on the Y axis 30 degrees towards the left.
 */
export function rotateYTicks () {
  // TODO : Rotate Y ticks.
  d3.selectAll('#songs-graph-g .y .tick').attr('transform', function () {
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
 * @param {string} targetColumn The column to use as domain
 */
export function updateRects (xScale, yScale, colorScale, targetColumn) {
  // TODO : Set position, size and fill of rectangles according to bound data
  d3.selectAll('#songs-graph-g .cell')
    .attr(
      'transform',
      (d) => `translate(${xScale(d.dayOfWeek)},${yScale(d.timeBlock)})`
    )
    .select('rect')
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('fill', (d) => colorScale(d[targetColumn]))
}
