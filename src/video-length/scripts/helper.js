/**
 * Generates the SVG element g which will contain the data visualisation.
 *
 * @param {object} margin The desired margins around the graph
 * @returns {*} The d3 Selection for the created g element
 */
export function generateG (margin) {
  // Sélectionne l'élément avec la classe '.video-length-graph'
  const graph = d3.select('.video-length-graph')

  // Sélectionne l'élément <svg> à l'intérieur de l'élément avec la classe '.video-length-graph'
  const svg = graph.select('svg')

  // Ajoute un élément <g> à l'élément <svg> pour regrouper les éléments du graphique
  const g = svg.append('g')
    .attr('id', 'video-length-graph-g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Retourne l'élément <g> nouvellement créé
  return g
}

/**
 * Sets the size of the SVG canvas containing the graph.
 *
 * @param {number} width The desired width
 * @param {number} height The desired height
 */
export function setCanvasSize (width, height) {
  // Sélectionne l'élément avec l'ID 'video-length-graph'
  const graph = d3.select('#video-length-graph')

  // Sélectionne l'élément <svg> à l'intérieur de l'élément avec l'ID 'video-length-graph'
  const svg = graph.select('svg')

  // Définit la largeur et la hauteur de l'élément <svg> pour définir la taille du canevas
  svg.attr('width', width)
    .attr('height', height)
}

/**
 * Appends an SVG g element which will contain the axes.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 */
export function appendAxes (g) {
  // Ajoute un élément <g> à l'élément 'g' spécifié, pour créer l'axe x
  g.append('g')
    .attr('class', 'x axis')

  // Ajoute un élément <g> à l'élément 'g' spécifié, pour créer l'axe y
  g.append('g')
    .attr('class', 'y axis')
}
