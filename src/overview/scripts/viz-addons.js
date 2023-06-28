import { mediaDisplayNamesMap } from '../../assets/media-names.js'

/**
 * Initializes the empty tooltip.
 */
export function initPanelDiv () {
  d3.select('#overview-panel')
    .classed('empty', true)
    .append('div')
    .text(
      "Click on a dot to display the selected media outlet's statistics for that month"
    )
    .style('text-align', 'center')
    .style('color', '#A4A4A4')
}

/**
 * Displays the information panel when a data point is clicked.
 *
 * @param {object} d The data bound to the clicked marker
 */
export function displayPanel (d) {
  const panel = d3.select('#overview-panel').classed('empty', false)

  const data = d.target.__data__

  panel.selectAll('*').remove()

  // Media name
  panel
    .append('div')
    .attr('class', 'overview-tooltip-title')
    .text(mediaDisplayNamesMap[data.média])

  // Year and month
  panel
    .append('div')
    .attr('class', 'overview-tooltip-subtitle')
    .text(
      new Date(data.date).toLocaleDateString('en', {
        year: 'numeric',
        month: 'long'
      })
    )

  // Number of videos
  panel
    .append('div')
    .attr('class', 'overview-tooltip-main-text')
    .text('Number of videos uploaded')
  panel
    .append('div')
    .attr('class', 'overview-tooltip-sub-text')
    .text(`${data.count.toLocaleString()}`)

  // Number of views
  panel
    .append('div')
    .attr('class', 'overview-tooltip-main-text')
    .text('Total Views')
  panel
    .append('div')
    .attr('class', 'ovewview-tooltip-sub-text')
    .text(`${data.vues.toLocaleString()}`)

  // Number of likes
  panel
    .append('div')
    .attr('class', 'overview-tooltip-main-text')
    .text('Total Likes')
  panel
    .append('div')
    .attr('class', 'ovewview-tooltip-sub-text')
    .text(`${data.likes.toLocaleString()}`)

  // Number of comments
  panel
    .append('div')
    .attr('class', 'overview-tooltip-main-text')
    .text('Total Comments')
  panel
    .append('div')
    .attr('class', 'ovewview-tooltip-sub-text')
    .text(`${data.commentaires.toLocaleString()}`)

  // Number of shares
  panel
    .append('div')
    .attr('class', 'overview-tooltip-main-text')
    .text('Total Shares')
  panel
    .append('div')
    .attr('class', 'ovewview-tooltip-sub-text')
    .text(`${data.partages.toLocaleString()}`)
}
