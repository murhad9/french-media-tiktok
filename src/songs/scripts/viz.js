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
 */
export function appendCircles (data) {
  d3.select('#songs-graph-g .points')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('fill', 'black')
    .attr('r', 5)
    .attr('stroke', 'white')
}

/**
 * Defines the log scale used to position the center of the circles in X.
 *
 * @param {object[]} data The data to which coordinates must be bound
 * @param {*} xScale The scale to be used for the x coordinate
 * @param {number} yPosition The fixed y position for each data point
 * @param {string} domainColumn The column used to determine the domain of the scale
 */
export function addCoordinatesToData (data, xScale, yPosition, domainColumn) {
  data.forEach(song => {
    const xPosition = xScale(song[domainColumn])
    song.x = xPosition
    song.y = yPosition
  })
}

/**
 * Defines the log scale used to position the center of the circles in X.
 *
 * @param {number} width The width of the graph
 * @param {object[]} data The data to be used
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
 * Initializes the simulation used to place the circles
 *
 * @param {object[]} data The data to be displayed
 * @param {*} xScale The scale to be used for the x coordinate
 * @param {number} yPosition The fixed y position for each data point
 * @param {string} domainColumn The column used to determine the domain of the scale
 * @returns {*} The generated simulation
 */
export function getSimulation (data, xScale, yPosition, domainColumn) {
  return d3.forceSimulation(data)
    .force('collision',
      d3.forceCollide()
        .strength(1)
        .radius(5) // change this based on the radius of each circle
    )
    .force('x',
      d3.forceX(d => xScale(d[domainColumn]))
        .strength(0) // proximity of points to their true x value
    )
    .force('y',
      d3.forceY(yPosition)
        .strength(0.01) // proximity of points to the center y value
    )
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
 * After the circles have been appended, this repositions them.
 *
 * @param {*} simulation The force simulation used for the points
 */
export function updateCircles (simulation) {
  simulation.on('tick', () => {
    d3.select('#songs-graph-g .points')
      .selectAll('circle')
      .attr('cx', (d) => {
        return d.x
      })
      .attr('cy', (d) => d.y)
  })
}
