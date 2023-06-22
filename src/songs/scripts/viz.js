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
 * Generates the title of the visualization.
 *
 * @param {string} title The title of the visualization
 * @param {number} width The width of the g element containing the visualization
 */
export function generateGraphTitle (title, width) {
  const svg = d3.select('#songs-graph-g')

  const graphTitle = d3.select('#songs .songs-title')
  if (graphTitle.node()) { // update title if it already exists
    graphTitle
      .attr('x', width / 2)
      .text(title)
  } else {
    svg.append('text')
      .attr('class', 'songs-title')
      .attr('x', width / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .text(title)
  }
}

/**
 * Generates the subtitle for the visualization.
 *
 * @param {Date} minDate The minimum displayed date
 * @param {Date} maxDate The maximum displayed date
 * @param {number} width The width of the g element containing the visualization
 */
export function generateGraphSubtitle (minDate, maxDate, width) {
  const svg = d3.select('#songs-graph-g')

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

  const subtitle = d3.select('#songs .songs-subtitle')
  if (subtitle.node()) {
    subtitle
      .attr('x', width / 2)
      .text(`From ${formattedMinDate} to ${formattedMaxDate}`)
  } else {
    svg.append('text')
      .attr('class', 'songs-subtitle')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#a4a4a4')
      .style('font-size', '14px')
      .text(`From ${formattedMinDate} to ${formattedMaxDate}`)
  }
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
 * Appends the label for the the x axis.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 */
export function appendGraphLabel (g) {
  g.append('text')
    .attr('class', 'x axis-text')
    .attr('font-size', 12)
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

  // domain must be set manually for symlog since nice() does not extend the domain to nice values
  const scale = min === 0 ? d3.scaleSymlog().domain([0, 30000]) : d3.scaleLog().domain([min, max])

  return scale
    .range([0, width])
    .nice()
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
        .strength(0.02) // proximity of points to the center y value
    )
}

/**
 * Draws the X axis at the bottom of the diagram.
 *
 * @param {*} xScale The scale to use to draw the axis
 * @param {number} width The width of the graph
 * @param {number} height The height of the graph
 * @param {string} title The title for the x axis
 */
export function drawXAxis (xScale, width, height, title) {
  let xAxisGenerator
  if (isNaN(xScale(0))) { // check if xScale is a symlog scale, necessary since the default axis ticks are poorly formatted
    xAxisGenerator = d3.axisBottom(xScale)
      .tickArguments([7, '~s'])
  } else {
    xAxisGenerator = d3.axisBottom(xScale)
      .tickValues(d3.range(0, 4) // manually set tick values for symlog scale
        .reduce((acc, val) => acc.concat(d3.range(10 ** val, 10 ** (val + 1), 10 ** val)), [0])
        .concat([10000, 20000, 30000]))
  }

  d3.select('#songs-graph-g .x.axis')
    .attr('transform', 'translate( 0, ' + height + ')')
    .style('color', '#C7C7C7')
    .call(xAxisGenerator)

  d3.select('#songs-graph-g .x.axis-text')
    .attr('x', width / 2)
    .attr('y', height + 30)
    .text(`${title}`)
    .style('fill', '#C7C7C7')

  d3.select('#songs-graph-g .x.axis')
    .selectAll('.tick line')
    .attr('y1', -4)

  if (!isNaN(xScale(0))) { // remove minor tick labels for symlog scale
    d3.selectAll('#songs-graph-g .tick text')
      .style('opacity', d => {
        return d === 0 || d3.range(0, 5).includes(Math.log10(d)) || d === 30000 ? 1 : 0
      })
  }
}

/**
 * After the circles have been appended, this repositions and resizes them.
 *
 * @param {object[]} data The data to be displayed
 * @param {*} simulation The force simulation used for the points
 * @param {*} radiusScale The scale used to calculate the radius of each point
 * @param {Function} displayPanel The function that displays the panel when a circle is clicked
 */
export function updateCircles (data, simulation, radiusScale, displayPanel) {
  d3.select('#songs-graph-g .points')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('fill', '#533458')
    .attr('stroke', '#292929')
    .attr('r', d => radiusScale(d.count))
    .on('mouseover', function () {
      const element = d3.select(this)
      element.transition()
        .duration(150) // Set the duration of the transition in milliseconds
        .attr('r', d => radiusScale(d.count) * 1.5)
      element.node().parentElement.append(this)
    })
    .on('mouseout', function () {
      const element = d3.select(this)
      element.transition()
        .duration(200)
        .attr('r', d => radiusScale(d.count))
    })
    .on('click', (event, d) => {
      d3.select('#songs-graph-g .points .selected').classed('selected', false)
      d3.select(event.target).classed('selected', true)
      displayPanel(d)
    })

  simulation.on('tick', () => {
    d3.select('#songs-graph-g .points')
      .selectAll('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
  })
}
