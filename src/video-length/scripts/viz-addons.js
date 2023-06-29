/**
 * Initializes the empty tooltip.
 */
export function initPanelDiv () {
  d3.select('#video-panel')
    .classed('empty', true)
    .append('div')
    .text('Click on a bar to display the statistics for the selected video length interval')
    .style('text-align', 'center')
    .style('color', '#A4A4A4')
}

/**
 * Displays the information panel when a data point is clicked.
 *
 * @param {object} d The data bound to the clicked marker
 */
export function displayPanel (d) {
  const panel = d3.select('#video-panel').classed('empty', false)

  const data = d.target.__data__

  panel.selectAll('*').remove()

  // Video length interval
  panel.append('div')
    .attr('class', 'video-length-tooltip-title')
    .text(`${data.intervalle1}s to ${data.intervalle2}s`)

  // Number of videos
  panel.append('div')
    .attr('class', 'video-length-tooltip-main-text')
    .text('Number of videos which used the song')
  panel.append('div')
    .attr('class', 'video-length-tooltip-sub-text')
    .text(`${data.count}`)

  // Average views
  panel.append('div')
    .attr('class', 'video-length-tooltip-main-text')
    .text('Average views per video')
  panel.append('div')
    .attr('class', 'video-length-tooltip-sub-text')
    .text(`${Math.round(data.vues).toLocaleString()}`)

  // Average likes
  panel.append('div')
    .attr('class', 'video-length-tooltip-main-text')
    .text('Average likes per video')
  panel.append('div')
    .attr('class', 'video-length-tooltip-sub-text')
    .text(`${Math.round(data.likes).toLocaleString()}`)

  // Average comments
  panel.append('div')
    .attr('class', 'video-length-tooltip-main-text')
    .text('Average comments per video')
  panel.append('div')
    .attr('class', 'video-length-tooltip-sub-text')
    .text(`${Math.round(data.commentaires).toLocaleString()}`)

  // Average shares
  panel.append('div')
    .attr('class', 'video-length-tooltip-main-text')
    .text('Average shares per video')
  panel.append('div')
    .attr('class', 'video-length-tooltip-sub-text')
    .text(`${Math.round(data.partages).toLocaleString()}`)
}
