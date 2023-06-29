/**
 * Aggregates the data according to video length.
 *
 * @param {object[]} data The data to aggregate
 * @returns {object[]} The aggregated data
 */
export function aggregateVideoLength (data) {
  const totals = {}

  // Calculate total statistics for each individual video length
  data.forEach((objet) => {
    const lengthSec = objet.duréeSecondes
    const likes = objet.likes
    const shares = objet.partages
    const comments = objet.commentaires
    const views = objet.vues

    if (totals[lengthSec]) {
      totals[lengthSec].likes += likes
      totals[lengthSec].partages += shares
      totals[lengthSec].commentaires += comments
      totals[lengthSec].vues += views
      totals[lengthSec].count++
    } else {
      totals[lengthSec] = {
        duréeSecondes: lengthSec,
        likes: likes,
        partages: shares,
        commentaires: comments,
        vues: views,
        count: 1
      }
    }
  })

  // Calculate averages for each individual video length
  const averages = Object.values(totals).map((group) => {
    const averageLikes = group.likes / group.count
    const averageShares = group.partages / group.count
    const averageComments = group.commentaires / group.count
    const averageViews = group.vues / group.count
    return {
      duréeSecondes: group.duréeSecondes,
      likes: averageLikes,
      partages: averageShares,
      commentaires: averageComments,
      vues: averageViews,
      count: group.count
    }
  })

  return averages
}

/**
 * Aggregates the data according to the interval in which each video length falls.
 *
 * @param {object[]} data The data to aggregate
 * @returns {object[]} The aggregated data
 */
export function aggregateByVideoLengthInterval (data) {
  const aggregatedData = []

  // Initialises object for every 25 interval up to 625s
  let lowerBound = 0
  for (let index = 0; index < 25; index++) {
    const temp = {
      intervalle1: lowerBound,
      intervalle2: lowerBound + 25,
      likes: 0,
      partages: 0,
      commentaires: 0,
      vues: 0,
      count: 0
    }
    lowerBound += 25
    aggregatedData.push(temp)
  }

  // Calculates the average metrics for each individual video length
  const groupedData = aggregateVideoLength(data)

  // Calculate total of averages for each interval
  groupedData.forEach((objet) => {
    for (const el of aggregatedData) {
      if (el.intervalle1 <= objet.duréeSecondes && el.intervalle2 > objet.duréeSecondes) {
        el.likes += objet.likes
        el.partages += objet.partages
        el.commentaires += objet.commentaires
        el.vues += objet.vues
        el.count += objet.count
      }
    }
  })

  // Calculate the average statistics for each interval
  aggregatedData.forEach((objet) => {
    if (objet.count !== 0) {
      objet.likes = objet.likes / objet.count
      objet.partages = objet.partages / objet.count
      objet.commentaires = objet.commentaires / objet.count
      objet.vues = objet.vues / objet.count
    }
  })

  return aggregatedData
}
