/**
 * Initialises the color scale used to represent video count.
 *
 * @param {object[]} data The data to display
 * @param {*} colorScale The color scale
 */
export function initColorScale (data, colorScale) {
  const paleColor = '#d7bddb'
  const darkColor = '#5e3764'

  // Définition du domaine de la colorScale en utilisant les valeurs minimale et maximale de la propriété 'count' dans les données
  colorScale.domain([d3.min(data, d => d.count), d3.max(data, d => d.count)])

    // Définition de l'interpolation de couleur pour la colorScale
    .interpolator(d3.interpolate(paleColor, darkColor))

    // Arrondissement des valeurs du domaine pour une échelle plus lisse
    .nice()
}

/**
 * Creates the histogram.
 *
 * @param {object[]} data The data to display
 * @param {number} width The width of the graph
 * @param {number} height The height of the graph
 * @param {string} engagementCategory The metric to represent on the histogram
 * @param {Function} displayPanel A callback function that displays the tooltip
 * @param {*} colorScale The color scale used to represent video count
 */
export function appendRects (data, width, height, engagementCategory, displayPanel, colorScale) {
  const svg = d3.select('#video-length-graph-g')

  // Ajouter l'axe X
  const xScale = d3
    .scaleBand()
    .domain(data.map(function (d) {
      return d.intervalle1 + 's - ' + d.intervalle2 + 's'
    }))
    .paddingInner(0.2)
    .paddingOuter(0.3)
    .range([0, width])

  d3.select('#video-length-graph-g .x.axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .attr('transform', 'rotate(-30)')
    .style('text-anchor', 'end')

  // Ajouter l'axe Y
  const nearestUpperPowerOfTen = Math.ceil(Math.log10(d3.max(data, d => d[engagementCategory]))) // cela permet à l'échelle Y de se terminer à une puissance de 10 propre
  const yScale = d3
    .scaleSymlog()
    .domain([0, 10 ** nearestUpperPowerOfTen])
    .range([height, 0])

  const yAxisGenerator = d3.axisLeft(yScale)
    .tickValues([0].concat(d3.range(0, nearestUpperPowerOfTen + 1).map(power => 10 ** power)))
    .tickFormat(d3.format('~s'))

  d3.select('#video-length-graph-g .y.axis')
    .call(yAxisGenerator)
    .selectAll('.tick line')
    .attr('x1', 7)

  // Créer et remplir les barres
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
    .on('click', function (d) {
      d3.select('#video-length-graph-g rect.selected').classed('selected', false)
      d3.select(this).classed('selected', true)
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
  // Sélectionne l'élément <g> avec l'ID 'video-length-graph-g'
  const svg = d3.select('#video-length-graph-g')

  // Formate les dates minimale et maximale au format souhaité
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

  // Sélectionne l'élément avec la classe '.video-length-subtitle'
  const subtitle = d3.select('#video-length .video-length-subtitle')

  if (subtitle.node()) {
    // Met à jour la position et le texte du sous-titre s'il existe déjà
    subtitle
      .attr('x', width / 2)
      .text(`From ${formattedMinDate} to ${formattedMaxDate}`)
  } else {
    // Crée un nouvel élément <text> pour représenter le sous-titre du graphique
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
  // Sélectionne l'élément <g> avec l'ID 'video-length-graph-g'
  const svg = d3.select('#video-length-graph-g')

  // Sélectionne l'élément avec la classe '.video-length-title'
  const graphTitle = d3.select('#video-length .video-length-title')

  if (graphTitle.node()) { // Vérifie si le titre existe déjà
    // Met à jour la position et le texte du titre s'il existe déjà
    graphTitle
      .attr('x', width / 2)
      .text(title)
  } else {
    // Crée un nouvel élément <text> pour représenter le titre du graphique
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
