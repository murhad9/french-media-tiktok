/**
 * Removes rows from the data if the value of the specified column matches the regular expression
 *
 * @param {object[]} data The data to from which rows need to be filtered
 * @param {string} column The column from which values will be matched
 * @param {RegExp} regex The regular expression to match
 * @returns {object[]} The data with matched rows filtered out
 */
export function filterOutRowsByValue (data, column, regex) {
  return data.filter(row => {
    return String(row[column]).search(regex) === -1
  })
}

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
 * @param {string[]} sumCols The columns to aggregate into a sum
 * @param {string[]} listCols The columns to aggregate into a list
 * @param {string[]} groupBy The columns to group by when aggregating
 * @returns {object[]} The data with the groupBy columns and the aggregated column
 */
export function aggregateColumns (data, sumCols, listCols, groupBy) {
  data = trim(data, sumCols.concat(groupBy).concat(listCols))
  const groupedData = d3.group(data, (d) => {
    return groupBy.map((column) => d[column]).join('-')
  })

  const aggregatedData = Array.from(groupedData, ([key, values]) => {
    const aggregation = {
      ...values[0],
      count: values.length
    }
    sumCols.forEach((target) => {
      const sum = d3.sum(values, (d) => d[target])
      const average = sum / values.length
      aggregation[target] = sum
      aggregation[`${target}Average`] = Math.floor(average)
    })
    listCols.forEach((column) => {
      aggregation[`${column}List`] = Array.from(new Set(values.map((value) => value[column])))
    })
    groupBy.forEach((column, index) => {
      aggregation[column] = key.split('-')[index]
    })
    return aggregation
  })

  return aggregatedData
}
