/**
 * Sets the domain of the color scale
 *
 * @param {*} colorScale The color scale used in the heatmap
 * @param {object[]} data The data to be displayed
 * @param {string} targetColumn The column to use as domain
 */
// export function setColorScaleDomain (colorScale, data, targetColumn) {
//   const averageViews = data.map((entry) => entry[targetColumn])
//   colorScale.domain(d3.extent(averageViews))
// }

/**
 * For each data element, appends a group 'g' to which an SVG rect is appended
 *
 * @param {object[]} data The data to use for binding
 */
// export function appendRects (data) {
//   // TODO : Append SVG rect elements
//   d3.select('#video-length-graph-g')
//     .selectAll('g.cell')
//     .data(data)
//     .enter()
//     .append('g')
//     .attr('class', 'cell')
//     .append('rect')
// }

/**
 * Updates the domain and range of the scale for the x axis
 *
 * @param {*} xScale The scale for the x axis
 * @param {number} width The width of the diagram
 */
// export function updateXScale (xScale, width) {
//   const daysOfWeekDomain = [
//     'Sunday',
//     'Monday',
//     'Tuesday',
//     'Wednesday',
//     'Thursday',
//     'Friday',
//     'Saturday'
//   ]
//   xScale.domain(daysOfWeekDomain).range([0, width])
// }

/**
 * Updates the domain and range of the scale for the y axis
 *
 * @param {*} yScale The scale for the y axis
 * @param {object[]} timeBlocks The names of the neighborhoods
 * @param {number} height The height of the diagram
 */
// export function updateYScale (yScale, timeBlocks, height) {
//   const sortedTimeBlocks = timeBlocks.sort()
//   yScale.domain(sortedTimeBlocks).range([0, height])
// }

/**
 *  Draws the X axis at the top of the diagram.
 *
 *  @param {*} xScale The scale to use to draw the axis
 */
// export function drawXAxis (xScale) {
//   // TODO : Draw X axis
//   const xAxisGenerator = d3.axisTop().scale(xScale)
//   d3.select('#video-length-graph-g .x').call(xAxisGenerator)
// }

/**
 * Draws the Y axis to the right of the diagram.
 *
 * @param {*} yScale The scale to use to draw the axis
 * @param {number} width The width of the graphic
 */
// export function drawYAxis (yScale, width) {
//   // TODO : Draw Y axis
//   const yAxisGenerator = d3.axisRight().scale(yScale)
//   d3.select('#video-length-graph-g .y')
//     .attr('transform', `translate(${width},0)`)
//     .call(yAxisGenerator)
// }

/**
 * Rotates the ticks on the Y axis 30 degrees towards the left.
 */
// export function rotateYTicks () {
//   // TODO : Rotate Y ticks.
//   d3.selectAll('#video-length-graph-g .y .tick').attr('transform', function () {
//     return d3.select(this).attr('transform') + ` rotate(${-30})`
//   })
// }

/**
 * After the rectangles have been appended, this function dictates
 * their position, size and fill color.
 *
 * @param {*} xScale The x scale used to position the rectangles
 * @param {*} yScale The y scale used to position the rectangles
 * @param {*} colorScale The color scale used to set the rectangles' colors
 * @param {string} targetColumn The column to use as domain
 * @param data
 */

/**
 * @param data
 * @param width
 * @param height
 * @param engagementCategory
 * @param tip
 */
export function appendRects (data, width, height, engagementCategory, displayPanel) {
  const echelleCouleurs = d3.scaleSequential()
    .domain([0, d3.max(data, d => d.count)])
    .interpolator(d3.interpolateReds) // Utilisation de la palette de couleurs Viridis

  const svg = d3.select('#video-length-graph-g')
  const x = d3
    .scaleBand()
    .domain(data.map(function (d) {
      return d.intervalle1 + 's - ' + d.intervalle2 + 's'
    }))
    .padding(0.2)
    .range([0, width])

  d3.select('#video-length-graph-g .x.axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end')

  // Add Y axis

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d[engagementCategory])]) // Utilisation de d3.max pour obtenir la valeur maximale des étoiles
    .range([height, 0])

  d3.select('#video-length-graph-g .y.axis').call(d3.axisLeft(y))

  // Create and fill the bars
  svg
    .selectAll('.bar')
    .remove()

  svg
    .selectAll('.bar') // Utilisation de la classe ".bar" pour sélectionner les barres
    .data(data)
    .join('rect')
    .attr('class', 'bar') // Ajout de la classe "bar" pour les éléments <rect>
    .attr('x', d => x(d.intervalle1 + 's - ' + d.intervalle2 + 's'))
    .attr('y', d => y(d[engagementCategory]))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d[engagementCategory]))
    .attr('fill', d => echelleCouleurs(d.count))
    .on('mouseover', function (d) {
      displayPanel(d);
      d3.select(this).attr('fill', 'black')
    })
    .on('mouseleave', function (d) {
      d3.select(this).attr('fill', d => echelleCouleurs(d.count))
    })
}

/**
 * @param data
 * @param width
 * @param height
 * @param engagementCategory
 */
export function appendRectsEvolve (data, width, height, engagementCategory) {
  const svg = d3.select('#video-length-graph-evolve-g')

  // Add Y axis

  // Regroupement des données par année
  const dataByYear = d3.group(data, d => {
    return d.date.toString().split('-')[0]
  })

  // Recherche de la vidéo avec le plus de vues par année
  const videosByYear = Array.from(dataByYear, ([year, videos]) => {
    const maxViewsVideo = d3.max(videos, d => d[engagementCategory])
    return {
      year: +year,
      maxViews: maxViewsVideo
    }
  })



  const x = d3.scaleLinear()
    .domain(d3.extent(videosByYear, d => d.year))
    .range([0, width])
  


  d3.select('#video-length-graph-evolve-g .x.axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickValues([2018, 2019, 2020, 2021, 2022, 2023]))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end')

  // Création de l'échelle en y
  const y = d3.scaleLinear()
    .domain([0, d3.max(videosByYear, d => d.maxViews)])
    .range([height, 0])

  d3.select('#video-length-graph-evolve-g .y.axis').call(d3.axisLeft(y))



  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.maxViews))

  d3.selectAll('.video-line-chart-line')
  .remove()

  svg.append('path')
    .attr('class', 'video-line-chart-line')
    .datum(videosByYear)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('d', line)
}

/**
 * Generates the subtitle for the visualization.
 *
 * @param {Date} minDate The minimum displayed date
 * @param {Date} maxDate The maximum displayed date
 * @param {number} width The width of the g element containing the visualization
 */
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
