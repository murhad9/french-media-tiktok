/* eslint-disable jsdoc/require-param-type */
/* eslint-disable jsdoc/require-param-description */

export function updateYScale (yScale, data, height, domainColumn) {
  yScale.domain([0, d3.max(data, d => d[domainColumn])]) // Utilisation de d3.max pour obtenir la valeur maximale des étoiles
    .range([height, 0])
    .nice()
}

export function appendRects (data, width, height, engagementCategory, tip, yScale) {
  const svg = d3.select('#hashtags-graph-g')
  const xScale = d3
    .scaleBand()
    .domain(data.map(function (d) {
      return d.hashtag
    }))
    .padding(0.2)
    .range([0, width])

  // Create the x axis
  d3.select('#hashtags-graph-g .x.axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale))

  d3.select('#hashtags-graph-g .x.axis')
    .selectAll('.tick text')
    .style('text-anchor', 'end')
    .style('font-size', '14')
    .style('font-weight', 'bold')
    .style('fill', 'white')
    .attr('transform', 'rotate(-30)')

  // Create the y axis
  d3.select('#hashtags-graph-g .y.axis').call(d3.axisLeft(yScale))

  // Create and fill the bars
  svg
    .selectAll('.bar')
    .remove()

  svg
    .selectAll('.bar') // Utilisation de la classe ".bar" pour sélectionner les barres
    .data(data)
    .join('rect')
    .attr('class', 'bar') // Ajout de la classe "bar" pour les éléments <rect>
    .attr('x', d => xScale(d.hashtag))
    .attr('y', d => yScale(d[engagementCategory]))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - yScale(d[engagementCategory]))
    .attr('fill', '#483248')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  d3.select('#hashtags-graph-g .y.axis')
    .selectAll('.tick line')
    .attr('x1', 7)
}

/**
 * Generates the subtitle for the visualization.
 *
 * @param {Date} minDate The minimum displayed date
 * @param {Date} maxDate The maximum displayed date
 * @param {number} width The width of the g element containing the visualization
 */
export function generateGraphSubtitle (minDate, maxDate, width) {
  const svg = d3.select('#hashtags-graph-g')

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

  const subtitle = d3.select('#hashtags .hashtags-subtitle')
  if (subtitle.node()) {
    subtitle
      .attr('x', width / 2)
      .text(`From ${formattedMinDate} to ${formattedMaxDate}`)
  } else {
    svg.append('text')
      .attr('class', 'hashtags-subtitle')
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
  const svg = d3.select('#hashtags-graph-g')

  const graphTitle = d3.select('#hashtags .hashtags-title')
  if (graphTitle.node()) { // update title if it already exists
    graphTitle
      .attr('x', width / 2)
      .text(title)
  } else {
    svg.append('text')
      .attr('class', 'hashtags-title')
      .attr('x', width / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .text(title)
  }
}
