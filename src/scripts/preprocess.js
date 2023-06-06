/**
 * Trims the data to only the wanted columns
 *
 * @param {object[]} data The data to analyze
 * @param {string[]} targets The columns to keep
 * @returns {object[]} The data with only the needed columns
 */
export function trim (data, targets) {
  return data.map((row) => {
    const trimmedRow = {}
    targets.forEach((target) => {
      trimmedRow[target] = row[target]
    })
    return trimmedRow
  })
}

/**
 * Aggregates specific columns
 *
 * @param {object[]} data The data to analyze
 * @param {string} targets The columns to aggregate
 * @param {string[]} groupBy The columns to group by when aggregating
 * @returns {object[]} The data with the groupBy columns and the aggregated column
 */
export function aggregateColumns (data, targets, groupBy) {
  data = trim(data, targets.concat(groupBy))
  console.log(data)
  const groupedData = d3.group(data, (d) => {
    return groupBy.map((column) => d[column]).join('-')
  })

  const aggregatedData = Array.from(groupedData, ([key, values]) => {
    const aggregation = {
      ...values[0]
    }
    targets.forEach((target) => {
      aggregation[target] = d3.sum(values, (d) => d[target])
    })
    groupBy.forEach((column, index) => {
      aggregation[column] = key.split('-')[index]
    })
    return aggregation
  })

  return aggregatedData
}

/**
 * Sorts the data by specific columns in order
 *
 * @param {object[]} data The data to analyze
 * @param {string[]} sortBy The columns to sort by, priority given to smallest index
 * @param {boolean} isDescending Determines if sort order is ascending or descending
 * @returns {object[]} The sorted data
 */
export function sortByColumns (data, sortBy, isDescending = false) {
  const sortedData = [...data] // Create a copy of the original data to avoid modifying it directly

  sortedData.sort((a, b) => {
    for (let i = 0; i < sortBy.length; i++) {
      const column = sortBy[i]
      let result = 0
      if (a[column] < b[column]) result = -1
      else if (a[column] > b[column]) result = 1

      if (isDescending) result = -result // Reverse the sorting order for descending

      if (result !== 0) return result
    }
    return 0
  })

  return sortedData
}
