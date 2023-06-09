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
 * @param {string} targets The columns to aggregate
 * @param {string[]} groupBy The columns to group by when aggregating
 * @returns {object[]} The data with the groupBy columns and the aggregated column
 */
export function aggregateColumns (data, targets, groupBy) {
  data = trim(data, targets.concat(groupBy))
  const groupedData = d3.group(data, (d) => {
    return groupBy.map((column) => d[column]).join('-')
  })

  const aggregatedData = Array.from(groupedData, ([key, values]) => {
    const aggregation = {
      ...values[0],
      count: values.length
    }
    targets.forEach((target) => {
      const sum = d3.sum(values, (d) => d[target])
      const average = sum / values.length
      aggregation[target] = sum
      aggregation[`${target}Average`] = Math.floor(average)
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

/**
 * Splits date into date and time and adds day of week
 *
 * @param {object[]} data The data to analyze
 * @returns {object[]} The data with the processed datetime and day of week
 */
export function processDateTime (data) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const processedData = data.map(item => {
    const dateTimeParts = item.date.split(' ')
    const date = dateTimeParts[0]
    const time = dateTimeParts[1]
    const dayOfWeekIndex = new Date(date).getDay()
    const dayOfWeek = daysOfWeek[dayOfWeekIndex]

    return {
      ...item,
      date: date,
      time: time,
      dayOfWeek: dayOfWeek
    }
  })
  return processedData
}

/**
 * Filters the data by only keeping entries within the dates.THIS FUNCTION ASSUMES processDateTime was applied.
 *
 * @param {object[]} data The data
 * @param {string} startDate The start date
 * @param {string} endDate The end date
 * @returns {object[]} The data within the dates
 */
export function filterDataByDates (data, startDate, endDate) {
  const filteredData = data.filter(obj => {
    const date = obj.date // Assuming the date column is in the format "yyyy-mm-dd"
    return date >= startDate && date <= endDate
  })

  return filteredData
}

/**
 * Adds time block dpending on time of publication
 *
 * @param {object[]} data The data to analyze
 * @param {number} timeBlockLength the length of the time block. Default is 2
 * @returns {object[]} The data with the time block clomun added
 */
export function addTimeBlocks (data, timeBlockLength = 2) {
  const processedData = data.map(item => {
    const timeParts = item.time.split(':')
    const hour = Number(timeParts[0])
    const minute = Number(timeParts[1])

    // Calculate the total minutes from 00:00
    const totalMinutes = hour * 60 + minute

    // Calculate the time block
    const timeBlockStart = Math.floor(totalMinutes / (timeBlockLength * 60)) * (timeBlockLength * 60)
    const timeBlockEnd = timeBlockStart + timeBlockLength * 60

    // Format the time block as HH:MM - HH:MM
    const timeBlock = `${String(Math.floor(timeBlockStart / 60)).padStart(2, '0')}:${String(timeBlockStart % 60).padStart(2, '0')} to ${String(Math.floor(timeBlockEnd / 60)).padStart(2, '0')}:${String(timeBlockEnd % 60).padStart(2, '0')}`

    return {
      ...item,
      timeBlock: timeBlock
    }
  })

  return processedData
}

/**
 * Returns a list of unique time blocks (useful to get the domain)
 *
 * @param {object[]} data The data to analyze
 * @returns {string[]} The unique timeBlocks in the data
 */
export function getUniqueTimeBlocks (data) {
  const uniqueTimeBlocks = new Set()

  data.forEach(item => {
    const timeBlock = item.timeBlock
    uniqueTimeBlocks.add(timeBlock)
  })

  return Array.from(uniqueTimeBlocks)
}

/**
 * Normalizes a column
 *
 * @param {object[]} data The data to analyze
 * @param {string} targetColumn The column to normalize
 * @returns {object[]} The column with the normalized data
 */
export function normalizeColumn (data, targetColumn) {
  const min = Math.min(...data.map(obj => obj[targetColumn]))
  const max = Math.max(...data.map(obj => obj[targetColumn]))
  data.forEach(obj => {
    obj[`${targetColumn}Normalized`] = (obj[targetColumn] - min) / (max - min)
  })

  return data
}
