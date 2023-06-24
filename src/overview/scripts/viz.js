import * as d3Collection from 'd3-collection'

/**
 * Updates the domain and range of the scale for the x axis
 *
 * @param {object[]} data The data to display
 * @param {*} xScale The scale for the x axis
 * @param {number} width The width of the diagram
 */
export function updateXScale (data, xScale, width) {
  const xExtent = d3.extent(data, (d) => new Date(d.date))

  xScale.domain(xExtent).range([0, width]).nice()
}

/**
 * Updates the domain and range of the scale for the y axis
 *
 * @param {*} yScale The scale for the y axis
 * @param {object[]} data The data to display
 * @param {number} height The height of the diagram
 * @param {string} domainColumn The column used to determine the domain of the scale
 */
export function updateYScale (yScale, data, height, domainColumn) {
  const yExtent = d3.extent(data, (row) => row[domainColumn])

  yScale.domain(yExtent).range([height, 0]).nice()
}

/**
 * Draws the X axis at the top of the diagram.
 *
 * @param {*} xScale The scale to use to draw the axis
 * @param {number} height The height of the graph
 */
export function drawXAxis (xScale, height) {
  const xAxisGenerator = d3.axisBottom().scale(xScale).ticks(10, d3.timeFormat('%b %Y'))
  d3.select('#overview-graph-g .x')
    .attr('transform', `translate(0,${height})`)
    .attr('color', 'white')
    .call(xAxisGenerator)
  d3.select('#overview-graph-g .x.axis')
    .selectAll('.tick text')
    .attr('transform', 'translate(-20, 15) rotate(-40)')
  d3.select('#overview-graph-g .x.axis')
    .selectAll('.tick line')
    .attr('y1', -4)
}

/**
 * Draws the Y axis to the right of the diagram.
 *
 * @param {*} yScale The scale to use to draw the axis
 */
export function drawYAxis (yScale) {
  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(8)
  d3.select('#overview-graph-g .y')
    .attr('color', 'white')
    .call(yAxisGenerator)
  d3.select('#overview-graph-g .y.axis')
    .selectAll('.tick line')
    .attr('x1', 7)
}

/**
 * After the rectangles have been appended, this function dictates
 * their position, size and fill color.
 *
 * @param {*} xScale The x scale used to position the rectangles
 * @param {*} yScale The y scale used to position the rectangles
 * @param {object[]} data The data to be displayed
 * @param {string} domainColumn The column used to determine the domain of the scale
 * @param {Function} displayPanel The function that displays the panel when a line is clicked
 * @param {string[]} selectedMediaList A string list of the selected media outlets
 */
export function updateLines (
  xScale,
  yScale,
  data,
  domainColumn,
  displayPanel,
  selectedMediaList
) {
  const sumstat = d3Collection
    .nest()
    .key((d) => d['média'])
    .entries(data)

  d3.selectAll('.drawn-line').remove()
  d3.select('#overview-graph-g .lines')
    .selectAll('.line')
    .append('g')
    .data(sumstat)
    .enter()
    .append('path')
    .attr('class', 'drawn-line')
    .attr('d', (d) => {
      if (selectedMediaList.includes(d.key)) {
        return d3
          .line()
          .x((d) => xScale(new Date(d.date)))
          .y((d) => yScale(d[domainColumn]))
          .curve(d3.curveLinear)(d.values)
      }
      return null
    })
    .style('fill', 'none')
    .style('stroke', '#6a4270')
    .style('stroke-width', 2)
    .on('mouseenter', function (d) {
      // draw other
      d3.select(this).style('stroke', '#387DAF').style('stroke-width', 4)
      // draw the circles too
      d3.selectAll('.drawn-circle')
        .filter((circleData) => {
          return circleData['média'] === d.target.__data__.key
        })
        .attr('r', 5)
        .style('fill', '#387DAF')
    })
    .on('mouseleave', function (d) {
      d3.select(this).style('stroke', '#6a4270').style('stroke-width', 2)
      // undraw the circles too
      d3.selectAll('.drawn-circle')
        .filter((circleData) => {
          return circleData['média'] === d.target.__data__.key
        })
        .attr('r', 3)
        .style('fill', '#6a4270')
    })

  d3.selectAll('.drawn-circle').remove()
  d3.select('#overview-graph-g .lines')
    .selectAll('.circle')
    .append('g')
    .data(data)
    .join('circle')
    .attr('class', 'drawn-circle')
    .filter((d) => {
      return selectedMediaList.includes(d['média'])
    })
    .attr('r', 3)
    .attr('fill', '#6a4270')
    .attr('transform', (d) => {
      return `translate(${xScale(new Date(d.date))},${yScale(d[domainColumn])})`
    })
    .on('mouseenter', function (d) {
      // draw other circles too
      d3.selectAll('.drawn-circle')
        .filter((circleData) => {
          return circleData['média'] === d.target.__data__['média']
        })
        .attr('r', 5)
        .style('fill', 'steelblue')

      // draw the line too
      d3.selectAll('.drawn-line')
        .filter((lineData) => {
          return lineData.key === d.target.__data__['média']
        })
        .style('stroke', 'steelblue')
        .style('stroke-width', 4)

      // set hovered circle with higher radius
      d3.select(this).style('fill', 'steelblue').attr('r', 7)
    })
    .on('mouseleave', function (d) {
      d3.select(this).style('fill', '#6a4270').attr('r', 3)

      // undraw other circles too
      d3.selectAll('.drawn-circle')
        .filter((circleData) => {
          return circleData['média'] === d.target.__data__['média']
        })
        .attr('r', 3)
        .style('fill', '#6a4270')

      // undraw the line too
      d3.selectAll('.drawn-line')
        .filter((lineData) => {
          return lineData.key === d.target.__data__['média']
        })
        .style('stroke', '#6a4270')
        .style('stroke-width', 2)
    })
    .on('click', function (d) {
      displayPanel(d)
    })
}

/**
 * Generates the subtitle for the visualization.
 *
 * @param {Date} minDate The minimum displayed date
 * @param {Date} maxDate The maximum displayed date
 * @param {number} width The width of the g element containing the visualization
 */
export function generateGraphSubtitle (minDate, maxDate, width) {
  const svg = d3.select('#overview-graph-g')

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

  const subtitle = d3.select('#overview .overview-subtitle')
  if (subtitle.node()) {
    subtitle
      .attr('x', width / 2)
      .text(`From ${formattedMinDate} to ${formattedMaxDate}`)
  } else {
    svg.append('text')
      .attr('class', 'overview-subtitle')
      .attr('x', width / 2)
      .attr('y', -10)
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
  const svg = d3.select('#overview-graph-g')

  const graphTitle = d3.select('#overview .overview-title')
  if (graphTitle.node()) { // update title if it already exists
    graphTitle
      .attr('x', width / 2)
      .text(title)
  } else {
    svg.append('text')
      .attr('class', 'overview-title')
      .attr('x', width / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .text(title)
  }
}
