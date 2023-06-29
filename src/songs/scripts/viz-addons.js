/**
 * Intialises the domain column selection dropdown in the control panel.
 *
 * @param {*} dropdown The dropdown to append
 * @param {Function} updateDomainColumn The callback function to call when a selection is made in the dropdown
 */
export function initDropdown (dropdown, updateDomainColumn) {
  d3.select('#songs-control .songs-dropdown')
    .append('div')
    .attr('class', 'songs-dropdown-title')
    .text('Sort by')

  dropdown.append(
    document.querySelector('#songs-control .songs-dropdown'),
    { 'Average Views': 'vuesAverage', 'Average Likes': 'likesAverage', 'Average Comments': 'commentairesAverage', 'Average Shares': 'partagesAverage' },
    updateDomainColumn
  )
}

/**
 * Initializes the time range slider in the control panel.
 *
 * @param {*} slider The slider to append
 * @param {Date} minDate The minimum date
 * @param {Date} maxDate The maximum date
 * @param {Function} updateTimeRange The callback function to call when the time range is updated
 */
export function initSlider (slider, minDate, maxDate, updateTimeRange) {
  d3.select('#songs-control .songs-slider')
    .append('div')
    .attr('class', 'songs-slider-title')
    .text('Time range')

  slider.append(document.querySelector('#songs-control .songs-slider'), minDate, maxDate, updateTimeRange)
}

/**
 * Initializes the empty tooltip.
 */
export function initPanelDiv () {
  d3.select('#songs-panel')
    .classed('empty', true)
    .append('div')
    .text('Click on a dot to display the selected song\'s statistics')
    .style('text-align', 'center')
    .style('color', '#A4A4A4')
}

/**
 * Displays the information panel when a data point is clicked.
 *
 * @param {object} d The data bound to the clicked marker
 */
export function displayPanel (d) {
  const panel = d3.select('#songs-panel').classed('empty', false)

  panel.selectAll('*').remove()

  // Song title
  panel.append('div')
    .attr('class', 'songs-tooltip-title')
    .text(d.musiqueTitre)

  // Song artist
  panel.append('div')
    .attr('class', 'songs-tooltip-subtitle')
    .text(d.musiqueArtiste)

  // Number of videos
  panel.append('div')
    .attr('class', 'songs-tooltip-main-text')
    .text('Number of videos which used the song')
  panel.append('div')
    .attr('class', 'songs-tooltip-sub-text')
    .text(`${d.count.toLocaleString()}`)

  // Average views
  panel.append('div')
    .attr('class', 'songs-tooltip-main-text')
    .text('Average views per video')
  panel.append('div')
    .attr('class', 'songs-tooltip-sub-text')
    .text(`${d.vuesAverage.toLocaleString()}`)

  // Average likes
  panel.append('div')
    .attr('class', 'songs-tooltip-main-text')
    .text('Average likes per video')
  panel.append('div')
    .attr('class', 'songs-tooltip-sub-text')
    .text(`${d.likesAverage.toLocaleString()}`)

  // Average comments
  panel.append('div')
    .attr('class', 'songs-tooltip-main-text')
    .text('Average comments per video')
  panel.append('div')
    .attr('class', 'songs-tooltip-sub-text')
    .text(`${d.commentairesAverage.toLocaleString()}`)

  // Average shares
  panel.append('div')
    .attr('class', 'songs-tooltip-main-text')
    .text('Average shares per video')
  panel.append('div')
    .attr('class', 'songs-tooltip-sub-text')
    .text(`${d.partagesAverage.toLocaleString()}`)

  // Media outlets
  const mediaDiv = panel.append('div')

  mediaDiv.append('div')
    .attr('class', 'songs-tooltip-main-text')
    .text(`List of accounts that used the song (${d.médiaList.length})`) // currently in our data, médiaList can have up to 19 elements

  const leftMediaList = d.médiaList.slice(0, (d.médiaList.length + 1) / 2)
  const rightMediaList = d.médiaList.slice((d.médiaList.length + 1) / 2)

  const listWrapper = mediaDiv.append('div').attr('class', 'songs-tooltip-list-wrapper')
  listWrapper.append('ul')
    .attr('class', 'songs-tooltip-list')
    .selectAll('li')
    .data(leftMediaList)
    .enter()
    .append('li')
    .text(d => d)
  listWrapper.append('ul')
    .attr('class', 'songs-tooltip-list')
    .selectAll('li')
    .data(rightMediaList)
    .enter()
    .append('li')
    .text(d => d)
}
