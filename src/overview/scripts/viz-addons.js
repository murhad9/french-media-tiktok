/**
 * Displays the information panel when a data point is clicked.
 *
 * @param {object} d The data bound to the clicked marker
 */
export function displayPanel (d) {
  const panel = d3.select('#overview-panel').style('visibility', 'visible')

  const data = d.target.__data__

  panel.selectAll('*').remove()

  // Media name
  panel
    .append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '20px')
    .style('font-weight', 'bold')
    .text(data['média'])

  // Select year and month
  panel
    .append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '18px')
    .text(data.date)

  // Number of videos
  panel
    .append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('padding-top', '25px')
    .text(`Number of videos: ${data.count}`)

  // Number of views
  panel
    .append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('padding-top', '25px')
    .text(`Total Views: ${data.vues}`)

  // Average views
  panel
    .append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('padding-top', '3px')
    .text(`Total likes: ${data.likes}`)

  // Average likes
  panel
    .append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('padding-top', '3px')
    .text(`Total comments: ${data.commentaires}`)

  // Average comments
  panel
    .append('div')
    .style('font-family', 'Roboto')
    .style('font-size', '16px')
    .style('padding-top', '3px')
    .text(`Total shares: ${data.partages}`)
}
