/* eslint-disable jsdoc/require-param-type */
/* eslint-disable jsdoc/require-param-description */

/**
 * @param data
 * @param width
 * @param height
 * @param engagementCategory
 * @param tip
 */
export function appendRects (data, width, height, engagementCategory, tip) {
  const svg = d3.select('#hashtags-graph-g')
  const x = d3
    .scaleBand()
    .domain(data.map(function (d) {
      return d.hashtag
    }))
    .padding(0.2)
    .range([0, width])

  d3.select('#hashtags-graph-g .x.axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('text-anchor', 'center')
    .style('font-size', '14')
    .style('font-weight', 'bold')
    .style('fill', 'white')

  // Add Y axis

  if (engagementCategory === 'likes') {
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.likes)]) // Utilisation de d3.max pour obtenir la valeur maximale des étoiles
      .range([height, 0])

    d3.select('#hashtags-graph-g .y.axis').call(d3.axisLeft(y))

    // Create and fill the bars
    svg
      .selectAll('.bar')
      .remove()

    svg
      .selectAll('.bar') // Utilisation de la classe ".bar" pour sélectionner les barres
      .data(data)
      .join('rect')
      .attr('class', 'bar') // Ajout de la classe "bar" pour les éléments <rect>
      .attr('x', d => x(d.hashtag))
      .attr('y', d => y(d.likes))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.likes))
      .attr('fill', d => '#483248')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  } else if (engagementCategory === 'partages') {
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.partages)]) // Utilisation de d3.max pour obtenir la valeur maximale des étoiles
      .range([height, 0])

    d3.select('#hashtags-graph-g .y.axis').call(d3.axisLeft(y))

    // Create and fill the bars
    svg
      .selectAll('.bar')
      .remove()
    svg
      .selectAll('.bar') // Utilisation de la classe ".bar" pour sélectionner les barres
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar') // Ajout de la classe "bar" pour les éléments <rect>
      .attr('x', d => x(d.hashtag))
      .attr('y', d => y(d.partages))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.partages))
      .attr('fill', d => '#483248')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  } else if (engagementCategory === 'commentaires') {
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.commentaires)]) // Utilisation de d3.max pour obtenir la valeur maximale des étoiles
      .range([height, 0])

    d3.select('#hashtags-graph-g .y.axis').call(d3.axisLeft(y))

    // Create and fill the bars
    svg
      .selectAll('.bar')
      .remove()
    svg
      .selectAll('.bar') // Utilisation de la classe ".bar" pour sélectionner les barres
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar') // Ajout de la classe "bar" pour les éléments <rect>
      .attr('x', d => x(d.hashtag))
      .attr('y', d => y(d.commentaires))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.commentaires))
      .attr('fill', d => '#483248')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  } else if (engagementCategory === 'vues') {
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.vues)]) // Utilisation de d3.max pour obtenir la valeur maximale des étoiles
      .range([height, 0])

    d3.select('#hashtags-graph-g .y.axis').call(d3.axisLeft(y))

    // Create and fill the bars
    svg
      .selectAll('.bar')
      .remove()
    svg
      .selectAll('.bar') // Utilisation de la classe ".bar" pour sélectionner les barres
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar') // Ajout de la classe "bar" pour les éléments <rect>
      .attr('x', d => x(d.hashtag))
      .attr('y', d => y(d.vues))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.vues))
      .attr('fill', d => '#483248')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
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
