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
 * @param {*} xScale The x scale used to position the rectangles
 * @param {*} yScale The y scale used to position the rectangles
 * @param {*} colorScale The color scale used to set the rectangles' colors
 * @param {string} targetColumn The column to use as domain
 * @param data
 */
// export function updateRects (xScale, yScale, colorScale, targetColumn) {
//   // TODO : Set position, size and fill of rectangles according to bound data
//   d3.selectAll('#video-length-graph-g .cell')
//     .attr(
//       'transform',
//       (d) => `translate(${xScale(d.dayOfWeek)},${yScale(d.timeBlock)})`
//     )
//     .select('rect')
//     .attr('width', xScale.bandwidth())
//     .attr('height', yScale.bandwidth())
//     .attr('fill', (d) => colorScale(d[targetColumn]))
// }

export function appendRects (data, width, height, engagementCategory, tip) {
  // engagementCategory = 'likes' // temporaire

  // const allColors = [
  //   '#7f3300',
  //   '#8c3900',
  //   '#994000',
  //   '#a64600',
  //   '#b34c00',
  //   '#bf5200',
  //   '#cc5700',
  //   '#d95d00',
  //   '#e66300',
  //   '#f26900',
  //   '#ff6e00',
  //   '#ff7931',
  //   '#ff844d',
  //   '#ff8f66',
  //   '#ff9b80',
  //   '#ffa699',
  //   '#ffb1b3',
  //   '#ffbccd',
  //   '#ffc8e6',
  //   '#ffd3f0',
  //   '#ffddfa',
  //   '#ffe8ff',
  //   '#fff2ff',
  //   '#fffdff',
  //   '#ffffff'
  // ]

  const echelleCouleurs = d3.scaleSequential()
    .domain([0,d3.max(data, d => d.count)])
    .interpolator(d3.interpolateReds) // Utilisation de la palette de couleurs Viridis

  const svg = d3.select('#video-length-graph-g')
  const x = d3
    .scaleBand()
    .domain(data.map(function(d) {
      return d.intervalle1 + 's - ' +  d.intervalle2 + 's';
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

  if (engagementCategory === 'likes') {
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.likes)]) // Utilisation de d3.max pour obtenir la valeur maximale des étoiles
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
      .attr('x', d => x(d.intervalle1 + 's - ' +  d.intervalle2 + 's'))
      .attr('y', d => y(d.likes))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.likes))
      .attr('fill', d => echelleCouleurs(d.count))
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  } 
 

  else if (engagementCategory === 'partages') {
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.partages)]) // Utilisation de d3.max pour obtenir la valeur maximale des étoiles
      .range([height, 0])

    d3.select('#video-length-graph-g .y.axis').call(d3.axisLeft(y))

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
      .attr('x', d => x(d.intervalle1 + 's - ' +  d.intervalle2 + 's'))
      .attr('y', d => y(d.partages))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.partages))
      .attr('fill', d => echelleCouleurs(d.count))
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  } 

  else if (engagementCategory === 'commentaires') {
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.commentaires)]) // Utilisation de d3.max pour obtenir la valeur maximale des étoiles
      .range([height, 0])

    d3.select('#video-length-graph-g .y.axis').call(d3.axisLeft(y))

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
      .attr('x', d => x(d.intervalle1 + 's - ' +  d.intervalle2 + 's'))
      .attr('y', d => y(d.commentaires))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.commentaires))
      .attr('fill', d => echelleCouleurs(d.count))
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  } 

  else if (engagementCategory === 'vues') {
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.vues)]) // Utilisation de d3.max pour obtenir la valeur maximale des étoiles
      .range([height, 0])

    d3.select('#video-length-graph-g .y.axis').call(d3.axisLeft(y))

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
      .attr('x', d => x(d.intervalle1 + 's - ' +  d.intervalle2 + 's'))
      .attr('y', d => y(d.vues))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.vues))
      .attr('fill', d => echelleCouleurs(d.count))
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  } 
  
}
