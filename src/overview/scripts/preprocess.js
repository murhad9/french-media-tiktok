/**
 * Changes the date property of every row of data to be at the beginning of its month.
 *
 * @param {object[]} data The data to process
 */
export function normalizeDates (data) {
  data.forEach(row => {
    const date = new Date(row.date)
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), 1)
    row.date = normalizedDate.getTime()
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
 * Removes all data past a certain upload date.
 *
 * @param {object[]} data The data that must be filtered
 * @param {Date} date The threshold past which data must be removed
 * @returns {object[]} The filtered data
 */
export function removeAfter (data, date) {
  return data.filter((row) => {
    return new Date(row.date) < date
  })
}

/**
 * Adds a year property to each row of data.
 *
 * @param {object[]} data The data to process
 * @returns {object[]} The new data with a year property for each row
 */
export function setYear (data) {
  return data.map((row) => {
    const year = new Date(row.date).getFullYear()
    return {
      ...row,
      year: parseInt(year)
    }
  })
}

/**
 * Returns a string list of all unique TikTok account names from the data.
 *
 * @param {object[]} data The data from which names will be extracted
 * @returns {string[]} The extracted names
 */
export function getMediaList (data) {
  return [
    ...new Set(
      data.map((row) => {
        return row['média']
      })
    )
  ]
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
      aggregation[`${column}List`] = Array.from(
        new Set(values.map((value) => value[column]))
      )
    })
    groupBy.forEach((column, index) => {
      aggregation[column] = key.split('-')[index]
    })
    return aggregation
  })

  return aggregatedData
}
