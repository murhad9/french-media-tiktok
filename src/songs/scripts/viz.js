/**
 * Sets the size of the SVG canvas containing the graph.
 *
 * @param {number} width The desired width
 * @param {number} height The desired height
 */
export function setCanvasSize (width, height) {
  d3.select('#songs-beeswarm-plot')
    .select('svg')
    .attr('width', width)
    .attr('height', height)
}

/**
 * Generates the SVG element g which will contain the data visualisation.
 *
 * @param {object} margin The desired margins around the graph
 * @returns {*} The d3 Selection for the created g element
 */
export function generateG (margin) {
  return d3
    .select('#songs-beeswarm-plot')
    .select('svg')
    .append('g')
    .attr('id', 'songs-graph-g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
}

/**
 * Appends an SVG g element which will contain the data points.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 */
export function appendPointG (g) {
  g.append('g').attr('class', 'points')
}

/**
 * Appends an SVG g element which will contain the axes.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 */
export function appendAxis (g) {
  g.append('g').attr('class', 'x axis')
}

/**
 * For each data element, appends an SVG circle to the points' g element
 *
 * @param {object[]} data The data to use for binding
 * @param {number} position The y position of the circles in the graph
 */
export function appendCircles (data, position) {
  d3.select('#songs-graph-g .points')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('fill', 'black')
    .attr('r', 5)
    .attr('stroke', 'white')
    .attr('cy', position)
}

/**
 * Defines the log scale used to position the center of the circles in X.
 *
 * @param {number} width The width of the graph
 * @param {object} data The data to be used
 * @param {string} domainColumn The column used to determine the domain of the scale
 * @returns {*} The logarithmic scale in X
 */
export function setXScale (width, data, domainColumn) {
  const min = d3.min(Object.values(data), song => song[domainColumn])
  const max = d3.max(Object.values(data), song => song[domainColumn])
  return d3.scaleLog()
    .domain([min, max])
    .range([0, width])
}

/**
 * Draws the X axis at the bottom of the diagram.
 *
 * @param {*} xScale The scale to use to draw the axis
 * @param {number} height The height of the graph
 */
export function drawXAxis (xScale, height) {
  const xAxisGenerator = d3.axisBottom(xScale).tickArguments([5, '~s'])
  d3.select('#songs-graph-g .x.axis')
    .attr('transform', 'translate( 0, ' + height + ')')
    .call(xAxisGenerator)
}

/**
 * After the circles have been appended, this function dictates
 * their position along the x axis.
 *
 * @param {*} xScale The x scale used to position the circles
 * @param {string} domainColumn The column used to determine the domain of the scale
 */
export function updateCircles (xScale, domainColumn) {
  d3.select('#songs-graph-g .points')
    .selectAll('circle')
    .attr('cx', d => xScale(d[domainColumn]))
}
