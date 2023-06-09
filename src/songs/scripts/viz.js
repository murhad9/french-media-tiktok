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
    .attr('stroke', 'white')
}

/**
 * Adds the appropriate x and y coordinates to each row of data
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
 * Updates the x coordinate for each row of data
 *
 * @param {object[]} data The data to which coordinates must be bound
 * @param {*} xScale The scale to be used for the x coordinate
 * @param {string} domainColumn The column used to determine the domain of the scale
 */
export function updateXCoordinateInData (data, xScale, domainColumn) {
  data.forEach(song => {
    const xPosition = xScale(song[domainColumn])
    song.x = xPosition
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
 * Defines the scale to use for the data points' radius.
 *
 * The area of the circle is proportional to the number of videos, which means that the
 * radius is proportional to the square root of the number of videos.
 *
 * @param {object} data The data to be displayed
 * @param {number} factor A factor to use for rescaling the circles
 * @returns {*} The square root scale used to determine the radius
 */
export function setRadiusScale (data, factor) {
  const minCount = d3.min(Object.values(data), song => song.count)
  const maxCount = d3.max(Object.values(data), song => song.count)
  return d3.scalePow()
    .exponent(0.5)
    .domain([minCount, maxCount])
    .range([4 * factor, 10 * factor])
}

/**
 * Initializes the simulation used to place the circles
 *
 * @param {object[]} data The data to be displayed
 * @param {*} xScale The scale to be used for the x coordinate
 * @param {number} yPosition The fixed y position for each data point
 * @param {string} domainColumn The column used to determine the domain of the scale
 * @param {*} radiusScale The scale used to calculate the radius of each point
 * @returns {*} The generated simulation
 */
export function getSimulation (data, xScale, yPosition, domainColumn, radiusScale) {
  return d3.forceSimulation(data)
    .force('collision',
      d3.forceCollide()
        .strength(1)
        .radius(d => radiusScale(d.count)) // change this based on the radius of each circle
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
 * After the circles have been appended, this repositions and resizes them.
 *
 * @param {*} simulation The force simulation used for the points
 * @param {*} radiusScale The scale used to calculate the radius of each point
 * @param {*} panel The display panel, which should be dislayed when a circle is clicked
 */
export function updateCircles (simulation, radiusScale, panel) {
  d3.select('#songs-graph-g .points')
    .selectAll('circle')
    .attr('r', d => radiusScale(d.count))
    .on('mouseover', function () {
      const element = d3.select(this)
      element.attr('r', d => radiusScale(d.count) * 1.5)
      element.node().parentElement.append(this)
    })
    .on('mouseout', function () {
      d3.select(this).attr('r', d => radiusScale(d.count))
    })
    .on('click', (event, d) => panel.display(d))

  simulation.on('tick', () => {
    d3.select('#songs-graph-g .points')
      .selectAll('circle')
      .attr('cx', (d) => {
        return d.x
      })
      .attr('cy', (d) => d.y)
  })
}
