
/**
 * Generates the SVG element g which will contain the data visualisation.
 *
 * @param {object} margin The desired margins around the graph
 * @returns {*} The d3 Selection for the created g element
 */
export function generateG (margin) {
  return d3
    .select('.video-length-graph')
    .select('svg')
    .append('g')
    .attr('id', 'video-length-graph-g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
}

/**
 * Sets the size of the SVG canvas containing the graph.
 *
 * @param {number} width The desired width
 * @param {number} height The desired height
 */
export function setCanvasSize (width, height) {
  d3.select('#video-length-heatmap')
    .select('svg')
    .attr('width', width)
    .attr('height', height)
}

/**
 * Appends an SVG g element which will contain the axes.
 *
 * @param {*} g The d3 Selection of the graph's g SVG element
 */
export function appendAxes (g) {
  g.append('g').attr('class', 'x axis')

  g.append('g').attr('class', 'y axis')
}

export function initButtons (switchAxis) {
  const buttonDiv = d3.select('.video-viz-container')
    .append('div')
    

  buttonDiv.append('button')
    
    .text('likes')
    .on('click', () => switchAxis('vuesAverage'))

  buttonDiv.append('button')
    
    .text('commentaires')
    .on('click', () => switchAxis('likesAverage'))

  buttonDiv.append('button')
    
    .text('partages')
    .on('click', () => switchAxis('commentairesAverage'))

  buttonDiv.append('button')
  
    .text('vues')
    .on('click', () => switchAxis('partagesAverage'))
}
