/**
 * Gets the names of the neighborhoods.
 *
 * @param {object[]} data The data to analyze
 * @returns {string[]} The names of the neighorhoods in the data set
 */
export function getNeighborhoodNames (data) {
  // TODO: Return the neihborhood names
  return [...new Set(data.map(entry => entry.Arrond_Nom))]
}

/**
 * Filters the data by the given years.
 *
 * @param {object[]} data The data to filter
 * @param {number} start The start year (inclusive)
 * @param {number} end The end year (inclusive)
 * @returns {object[]} The filtered data
 */
export function filterYears (data, start, end) {
  // TODO : Filter the data by years
  const filtered = data.filter(entry => {
    const entryYear = new Date(entry.Date_Plantation).getUTCFullYear()
    return entryYear >= start && entryYear <= end
  })
  return filtered
}

/**
 * Summarizes how any trees were planted each year in each neighborhood.
 *
 * @param {object[]} data The data set to use
 * @returns {object[]} A table of objects with keys 'Arrond_Nom', 'Plantation_Year' and 'Counts', containing
 * the name of the neighborhood, the year and the number of trees that were planted
 */
export function summarizeYearlyCounts (data) {
  // TODO : Construct the required data table
  const summarized = []
  data.forEach(entry => {
    const entryYear = new Date(entry.Date_Plantation).getUTCFullYear()
    let summary = summarized.find(e => e.Plantation_Year === entryYear && e.Arrond_Nom === entry.Arrond_Nom)
    if (!summary) {
      summary = { Arrond_Nom: entry.Arrond_Nom, Plantation_Year: entryYear, Counts: 0 }
      summarized.push(summary)
    }
    summary.Counts += 1
  })
  return summarized
}

/**
 * For the heat map, fills empty values with zeros where a year is missing for a neighborhood because
 * no trees were planted or the data was not entered that year.
 *
 * @param {object[]} data The datas set to process
 * @param {string[]} neighborhoods The names of the neighborhoods
 * @param {number} start The start year (inclusive)
 * @param {number} end The end year (inclusive)
 * @param {Function} range A utilitary function that could be useful to get the range of years
 * @returns {object[]} The data set with a new object for missing year and neighborhood combinations,
 * where the values for 'Counts' is 0
 */
export function fillMissingData (data, neighborhoods, start, end, range) {
  // TODO : Find missing data and fill with 0
  const years = range(start, end)
  const filled = []
  neighborhoods.forEach(neighborhood => {
    years.forEach(year => {
      let hit = data.find(e => e.Plantation_Year === year && e.Arrond_Nom === neighborhood)
      if (!hit) {
        hit = { Arrond_Nom: neighborhood, Plantation_Year: year, Counts: 0 }
      }
      filled.push(hit)
    })
  })
  return filled
}
