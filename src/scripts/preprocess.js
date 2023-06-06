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
 * Aggregates a specific column
 *
 * @param {object[]} data The data to analyze
 * @param {string} target The column to aggregate
 * @param {string[]} groupBy The columns to group by when aggregating
 * @returns {object[]} The data with the groupBy columns and the aggregated column
 */
export function aggregateColumn(data, target, groupBy) {
  const groupedData = d3.group(data, (d) => {
    return groupBy.map((column) => d[column]).join('-')
  })

  const aggregatedData = Array.from(groupedData, ([key, values]) => {
    const aggregation = {
      ...values[0],
      [target]: d3.sum(values, (d) => d[target])
    }
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
 * @param {string} sortBy The columns to sort by, priority given to smallest index
 * @returns {object[]} The sorted data
 */
export function sortByColumns(data, sortBy) {
  const sortedData = [...data] // Create a copy of the original data to avoid modifying it directly

  sortedData.sort((a, b) => {
    for (let i = 0; i < sortBy.length; i++) {
      const column = sortBy[i]
      if (a[column] < b[column]) {
        return -1
      } else if (a[column] > b[column]) {
        return 1
      }
    }
    return 0
  })

  return sortedData
}
