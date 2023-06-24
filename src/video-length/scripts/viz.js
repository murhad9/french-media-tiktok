export function initColorScale (data, colorScale) {
  const paleColor = '#d7bddb'
  const darkColor = '#5e3764'

  colorScale.domain([d3.min(data, d => d.count), d3.max(data, d => d.count)])
    .interpolator(d3.interpolate(paleColor, darkColor))
    .nice()
}

export function appendRects (data, width, height, engagementCategory, displayPanel, colorScale) {
  const svg = d3.select('#video-length-graph-g')

  // Add X axis

  const xScale = d3
    .scaleBand()
    .domain(data.map(function (d) {
      return d.intervalle1 + 's - ' + d.intervalle2 + 's'
    }))
    .padding(0.2)
    .range([0, width])

  d3.select('#video-length-graph-g .x.axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .attr('transform', 'rotate(-30)')
    .style('text-anchor', 'end')

  // Add Y axis

  const nearestUpperPowerOfTen = Math.ceil(Math.log10(d3.max(data, d => d[engagementCategory]))) // this allows the y scale to end at a clean power of 10
  const yScale = d3
    .scaleSymlog()
    .domain([0, 10 ** nearestUpperPowerOfTen])
    .range([height, 0])

  const yAxisGenerator = d3.axisLeft(yScale)
    .tickValues([0].concat(d3.range(0, nearestUpperPowerOfTen + 1).map(power => 10 ** power)))

  d3.select('#video-length-graph-g .y.axis').call(yAxisGenerator)

  // Create and fill the bars
  svg
    .selectAll('.bar')
    .remove()

  svg
    .selectAll('.bar') // Utilisation de la classe ".bar" pour sélectionner les barres
    .data(data)
    .join('rect')
    .attr('class', 'bar') // Ajout de la classe "bar" pour les éléments <rect>
    .attr('x', d => xScale(d.intervalle1 + 's - ' + d.intervalle2 + 's'))
    .attr('y', d => yScale(d[engagementCategory]))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - yScale(d[engagementCategory]))
    .attr('fill', d => colorScale(d.count))
    .on('mouseover', function (d) {
      displayPanel(d)
      d3.select(this).attr('fill', 'black')
    })
    .on('mouseleave', function (d) {
      d3.select(this).attr('fill', d => colorScale(d.count))
    })
}

export function generateGraphSubtitle (minDate, maxDate, width) {
  const svg = d3.select('#video-length-graph-g')

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

  const subtitle = d3.select('#video-length .video-length-subtitle')
  if (subtitle.node()) {
    subtitle
      .attr('x', width / 2)
      .text(`From ${formattedMinDate} to ${formattedMaxDate}`)
  } else {
    svg.append('text')
      .attr('class', 'video-length-subtitle')
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
  const svg = d3.select('#video-length-graph-g')

  const graphTitle = d3.select('#video-length .video-length-title')
  if (graphTitle.node()) { // update title if it already exists
    graphTitle
      .attr('x', width / 2)
      .text(title)
  } else {
    svg.append('text')
      .attr('class', 'video-length-title')
      .attr('x', width / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .text(title)
  }
}
