
export function appendRects (data, width, height, engagementCategory, tip) {
  console.log(data)
  const svg = d3.select('#hashtags-graph-g')
  const x = d3
    .scaleBand()
    .domain(data.map(function(d) {
      return d.hashtag
    }))
    .padding(0.2)
    .range([0, width])

  d3.select('#hashtags-graph-g .x.axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .style('text-anchor', 'center')
    .style('font-size', '14')
    .style('font-weight', 'bold')

  // Add Y axis

  if (engagementCategory === 'likes') {
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.likes)]) // Utilisation de d3.max pour obtenir la valeur maximale des étoiles
      .range([height, 0])

    d3.select('#hashtags-graph-g .y.axis').call(d3.axisLeft(y))

    // Create and fill the bars
    svg
      .selectAll('.bar')
      .remove()


    svg
      .selectAll('.bar') // Utilisation de la classe ".bar" pour sélectionner les barres
      .data(data)
      .join('rect')
      .attr('class', 'bar') // Ajout de la classe "bar" pour les éléments <rect>
      .attr('x', d => x(d.hashtag))
      .attr('y', d => y(d.likes))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.likes))
      .attr('fill', d => '#483248')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  } 
 

  else if (engagementCategory === 'partages') {
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.partages)]) // Utilisation de d3.max pour obtenir la valeur maximale des étoiles
      .range([height, 0])

    d3.select('#hashtags-graph-g .y.axis').call(d3.axisLeft(y))

    // Create and fill the bars
    svg
      .selectAll('.bar')
      .remove()
    svg
      .selectAll('.bar') // Utilisation de la classe ".bar" pour sélectionner les barres
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar') // Ajout de la classe "bar" pour les éléments <rect>
      .attr('x', d => x(d.hashtag))
      .attr('y', d => y(d.partages))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.partages))
      .attr('fill', d => '#483248')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  } 

  else if (engagementCategory === 'commentaires') {
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.commentaires)]) // Utilisation de d3.max pour obtenir la valeur maximale des étoiles
      .range([height, 0])

    d3.select('#hashtags-graph-g .y.axis').call(d3.axisLeft(y))

    // Create and fill the bars
    svg
      .selectAll('.bar')
      .remove()
    svg
      .selectAll('.bar') // Utilisation de la classe ".bar" pour sélectionner les barres
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar') // Ajout de la classe "bar" pour les éléments <rect>
      .attr('x', d => x(d.hashtag))
      .attr('y', d => y(d.commentaires))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.commentaires))
      .attr('fill', d => '#483248')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  } 

  else if (engagementCategory === 'vues') {
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.vues)]) // Utilisation de d3.max pour obtenir la valeur maximale des étoiles
      .range([height, 0])

    d3.select('#hashtags-graph-g .y.axis').call(d3.axisLeft(y))

    // Create and fill the bars
    svg
      .selectAll('.bar')
      .remove()
    svg
      .selectAll('.bar') // Utilisation de la classe ".bar" pour sélectionner les barres
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar') // Ajout de la classe "bar" pour les éléments <rect>
      .attr('x', d => x(d.hashtag))
      .attr('y', d => y(d.vues))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.vues))
      .attr('fill', d => '#483248')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
  } 
  
}
