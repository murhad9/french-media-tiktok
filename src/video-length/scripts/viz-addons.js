/**
 * Displays the information panel when a data point is clicked.
 *
 * @param {object} d The data bound to the clicked marker
 */
export function displayPanel (d) {
  const panel = d3.select('#video-panel').style('visibility', 'visible')

  const data = d.target.__data__

  panel.selectAll('*').remove()

  // Title
  panel
    .append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '18px')
    .style('font-weight', 'bold')
    .style('padding-top', '25px')
    .text(`${data.intervalle1}s to ${data.intervalle2}s`)

  // Number of videos
  panel
    .append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('padding-top', '25px')
    .text(`Number of videos: ${Math.round(data.count)}`)

  // Number of views
  panel
    .append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('padding-top', '25px')
    .text(`Total Views: ${Math.round(data.vues)}`)

  // Average views
  panel
    .append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('padding-top', '3px')
    .text(`Total likes: ${Math.round(data.likes)}`)

  // Average likes
  panel
    .append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('padding-top', '3px')
    .text(`Total comments: ${Math.round(data.commentaires)}`)

  // Average comments
  panel
    .append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('padding-top', '3px')
    .text(`Total shares: ${Math.round(data.partages)}`)
}
