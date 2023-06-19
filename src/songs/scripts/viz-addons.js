/**
 * Initializes the div which will contain the information panel.
 */
export function initPanelDiv () {
  d3.select('#songs-beeswarm-plot')
    .append('div')
    .attr('id', 'songs-panel')
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
