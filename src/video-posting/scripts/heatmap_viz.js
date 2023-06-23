/**
 * Sets the domain of the color scale
 *
 * @param {*} colorScale The color scale used in the heatmap
 * @param {object[]} data The data to be displayed
 * @param {string} targetColumn The column to use as domain
 */
export function setColorScaleDomain (colorScale, data, targetColumn) {
  const target = data.map((entry) => entry[targetColumn])
  colorScale.domain(d3.extent(target))
}

/**
 * For each data element, appends a group 'g' to which an SVG rect is appended
 *
 * @param {object[]} data The data to use for binding
 */
export function appendRects (data) {
  d3.select('#video-posting-graph-g')
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
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
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
  d3.select('#video-posting-graph-g .x').call(xAxisGenerator)
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
  d3.select('#video-posting-graph-g .y')
    .attr('transform', `translate(${width},0)`)
    .call(yAxisGenerator)
}

/**
 * Rotates the ticks on the Y axis 30 degrees towards the left.
 */
export function rotateYTicks () {
  // TODO : Rotate Y ticks.
  d3.selectAll('#video-posting-graph-g .y .tick').attr(
    'transform',
    function () {
      return d3.select(this).attr('transform') + ` rotate(${-30})`
    }
  )
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
  d3.selectAll('#video-posting-graph-g .cell')
    .attr(
      'transform',
      (d) => `translate(${xScale(d.dayOfWeek)},${yScale(d.timeBlock)})`
    )
    .select('rect')
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('fill', (d) => colorScale(d[targetColumn]))
}

/**
 * Generates the subtitle for the visualization.
 *
 * @param {Date} minDate The minimum displayed date
 * @param {Date} maxDate The maximum displayed date
 * @param {number} width The width of the g element containing the visualization
 */
export function generateGraphSubtitle (minDate, maxDate, width) {
  const svg = d3.select('#video-posting-graph-g')

  const formattedMinDate = minDate.toLocaleDateString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const formattedMaxDate = maxDate.toLocaleDateString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const subtitle = d3.select('#video-posting .video-posting-subtitle')
  if (subtitle.node()) {
    subtitle
      .attr('x', width / 2)
      .text(`From ${formattedMinDate} to ${formattedMaxDate}`)
  } else {
    svg.append('text')
      .attr('class', 'video-posting-subtitle')
      .attr('x', width / 2)
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .attr('fill', '#a4a4a4')
      .style('font-size', '14px')
      .text(`From ${formattedMinDate} to ${formattedMaxDate}`)
  }
}

/**
 * Generates the title of the visualization.
 *
 * @param {string} title The title of the visualization
 * @param {number} width The width of the g element containing the visualization
 */
export function generateGraphTitle (title, width) {
  const svg = d3.select('#video-posting-graph-g')

  const graphTitle = d3.select('#video-posting .video-posting-title')
  if (graphTitle.node()) { // update title if it already exists
    graphTitle
      .attr('x', width / 2)
      .text(title)
  } else {
    svg.append('text')
      .attr('class', 'video-posting-title')
      .attr('x', width / 2)
      .attr('y', -75)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .text(title)
  }
}
