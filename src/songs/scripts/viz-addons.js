/**
 * Initializes the div which will contain the information panel.
 */
export function initPanelDiv () {
  const songPanel = d3.select('#songs-beeswarm-plot')
    .append('div')
    .attr('id', 'songs-panel')

  // Placeholder text
  songPanel.append('div')
    .text('Click on a dot to display the selected media\'s statistics')
    .style('text-align', 'center')
    .style('color', '#A4A4A4')
}

/**
 * Displays the information panel when a data point is clicked.
 *
 * @param {object} d The data bound to the clicked marker
 */
export function displayPanel (d) {
  const panel = d3.select('#songs-panel')

  panel.selectAll('*').remove()

  // Song title
  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '20px')
    .style('font-weight', 'bold')
    .style('text-align', 'center')
    .style('color', '#fff')
    .text(d.musiqueTitre)

  // Song artist
  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('text-align', 'center')
    .style('color', '#A4A4A4')
    .text(d.musiqueArtiste)

  // Number of videos
  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .style('padding-top', '25px')
    .text('Number of videos which used the song')

  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('font-weight', 'none')
    .style('padding-top', '3px')
    .text(`${d.count}`)

  // Average views
  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .style('padding-top', '10px')
    .text('Average views per video')

  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('font-weight', 'none')
    .style('padding-top', '3px')
    .text(`${d.vuesAverage}`)

  // Average likes
  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .style('padding-top', '10px')
    .text('Average likes per video')

  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('font-weight', 'none')
    .style('padding-top', '3px')
    .text(`${d.likesAverage}`)

  // Average shares
  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .style('padding-top', '10px')
    .text('Average shares per video')

  panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('font-weight', 'none')
    .style('padding-top', '3px')
    .text(`${d.partagesAverage}`)

  // Media outlets
  const mediaDiv = panel.append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')

  mediaDiv.append('div')
    .style('padding-top', '20px')
    .style('font-weight', 'bold')
    .text(`List of accounts that used the song (${d.médiaList.length})`)

  mediaDiv.append('div')
    .append('ul')
    .selectAll('li')
    .data(d.médiaList)
    .enter()
    .append('li')
    .text(d => d) // currently in our data, this list can have up to 19 elements
}
