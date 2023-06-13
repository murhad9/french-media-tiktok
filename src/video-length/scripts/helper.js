
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
    .on('click', () => switchAxis('likes'))

  buttonDiv.append('button')
    
    .text('commentaires')
    .on('click', () => switchAxis('commentaires'))

  buttonDiv.append('button')
    
    .text('partages')
    .on('click', () => switchAxis('partages'))

  buttonDiv.append('button')
  
    .text('vues')
    .on('click', () => switchAxis('vues'))
}

export function getContents (d, engagementCategory) {
  /* TODO : Define and return the tooltip contents including :
      + A title stating the hovered element's group, with:
        
Font family: Grenze Gotish
Font size: 24px
Font weigth: normal+ A bold label for the player name followed
  by the hovered elements's player's name+ A bold label for the player's line count
  followed by the number of lines
*/

const target = d3.select(d.target)


if(engagementCategory === 'likes') {
  return  `<div class='tooltip'>
<span class='tooltiptext'>${target.data()[0].count} </br>videos</br> posted
</br>
</br>
Average likes: ${Math.round(target.data()[0].likes)}
</span>
</div>

`
}
else if(engagementCategory === 'partages') {
  return  `<div class='tooltip'>
<span class='tooltiptext'>${target.data()[0].count} </br>videos</br> posted
</br>
</br>
Average shares: ${Math.round(target.data()[0].partages)}
</span>
</div>
`
}
else if(engagementCategory === 'vues') {
  return  `<div class='tooltip'>
<span class='tooltiptext'>${target.data()[0].count} </br>videos</br> posted
</br>
</br>
Average views: ${Math.round(target.data()[0].vues)}
</span>
</div>

`
}
else if(engagementCategory === 'commentaires') {
  return  `<div class='tooltip'>
<span class='tooltiptext'>${target.data()[0].count} </br>videos</br> posted
</br>
</br>
Average comments: ${Math.round(target.data()[0].commentaires)}

</span>
</div>

`
  }

}
