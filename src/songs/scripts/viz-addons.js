/**
 * Initializes the div which will contain the information panel.
 */
export function initPanelDiv () {
  d3.select('#songs-beeswarm-plot')
    .append('div')
    .attr('id', 'songs-panel')
}

/**
 * Initializes the buttons which will allow the user to switch the variable used for the x axis.
 *
 * @param {Function} switchAxis Callback function used to switch the x axis
 */
export function initButtons (switchAxis) {
  const buttonDiv = d3.select('#songs-viz-wrapper')
    .append('div')
    .attr('id', 'songs-sidebar-buttons')

  buttonDiv.append('button')
    .attr('class', 'songs-button')
    .text('Views')
    .on('click', () => switchAxis('vuesAverage'))

  buttonDiv.append('button')
    .attr('class', 'songs-button')
    .text('Likes')
    .on('click', () => switchAxis('likesAverage'))

  buttonDiv.append('button')
    .attr('class', 'songs-button')
    .text('Comments')
    .on('click', () => switchAxis('commentairesAverage'))

  buttonDiv.append('button')
    .attr('class', 'songs-button')
    .text('Shares')
    .on('click', () => switchAxis('partagesAverage'))
}

/**
 * Displays the information panel when a data point is clicked.
 *
 * @param {object} d The data bound to the clicked marker
 */
export function displayPanel (d) {
  const panel = d3.select('#songs-panel').style('visibility', 'visible')

  panel.selectAll('*').remove()

  // "FERMER" button
  panel.append('div')
    .style('text-align', 'right')
    .style('font-family', 'Roboto')
    .style('font-size', '12px')
    .style('cursor', 'pointer')
    .text('CLOSE')
    .on('click', () => {
      panel.style('visibility', 'hidden')
      d3.select('#songs-graph-g .points .selected').classed('selected', false)
    })

  // Song title
  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '20px')
    .style('font-weight', 'bold')
    .text(d.musiqueTitre)

  // Song artist
  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '18px')
    .text(d.musiqueArtiste)

  // Number of videos
  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('padding-top', '25px')
    .text(`Number of videos: ${d.count}`)

  // Average views
  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('padding-top', '3px')
    .text(`Average views: ${d.vuesAverage}`)

  // Average likes
  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('padding-top', '3px')
    .text(`Average likes: ${d.likesAverage}`)

  // Average comments
  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('padding-top', '3px')
    .text(`Average comments: ${d.commentairesAverage}`)

  // Average shares
  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('padding-top', '3px')
    .text(`Average shares: ${d.partagesAverage}`)

  // Media outlets
  const mediaDiv = panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')

  mediaDiv.append('div')
    .style('padding-top', '20px')
    .style('font-weight', 'bold')
    .text(`Media outlets (${d.médiaList.length})`)

  mediaDiv.append('div')
    .text(`${d.médiaList.join(', ')}`) // currently in our data, this list can have up to 19 elements
}
