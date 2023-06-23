/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-returns */

/**
 * Generates the SVG element g which will contain the data visualisation.
 *
 * @param {object} margin The desired margins around the graph
 * @returns {*} The d3 Selection for the created g element
 */
export function generateG (margin) {
  return d3
    .select('.hashtags-graph')
    .select('svg')
    .append('g')
    .attr('id', 'hashtags-graph-g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
}

/**
 * Sets the size of the SVG canvas containing the graph.
 *
 * @param {number} width The desired width
 * @param {number} height The desired height
 */
export function setCanvasSize (width, height) {
  d3.select('#hashtags-heatmap')
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
  g.append('g').attr('class', 'x axis').style('color', 'white')

  g.append('g').attr('class', 'y axis').style('color', 'white')
}

export function getContents (d, engagementCategory) {
  const target = d3.select(d.target)

  if (engagementCategory === 'likes') {
    return `<div class='tooltip'>
    <span class='tooltiptext' style="padding: 10px; width: 200px">${target.data()[0].hashtag}
        </br>
        </br>
        Average likes: ${Math.round(target.data()[0].likes)}
        </span>
        </div>

    `
  } else if (engagementCategory === 'partages') {
    return `<div class='tooltip'>
      <span class='tooltiptext' style="padding: 10px; width: 200px">${target.data()[0].hashtag}
        </br>
        </br>
        Average shares: ${Math.round(target.data()[0].partages)}
        </span>
        </div>
    `
  } else if (engagementCategory === 'vues') {
    return `<div class='tooltip'>
      <span class='tooltiptext' style="padding: 10px; width: 200px">${target.data()[0].hashtag}
        </br>
        </br>
        Average views: ${Math.round(target.data()[0].vues)}
        </span>
        </div>

    `
  } else if (engagementCategory === 'commentaires') {
    return `<div class='tooltip'>
      <span class='tooltiptext' style="padding: 10px; width: 200px">${target.data()[0].hashtag}
        </br>
        </br>
        Average comments: ${Math.round(target.data()[0].commentaires)}

        </span>
        </div>
    `
  }
}
