/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/check-param-names */

/**
 * Returns the list of the most popular hashtags with fromTo dates
 *
 * @param {object[]} data The data to analyze
 * @returns {object[]} The column with the normalized data
 */
export function groupByHashtag (data, fromToDates) {
  const totals = {}

  data.forEach((objet) => {
    if (new Date(objet.date).getTime() >= fromToDates.from.getTime() &&
    new Date(objet.date).getTime() <= fromToDates.to.getTime()) {
      const likes = objet.likes
      const shares = objet.partages
      const comments = objet.commentaires
      const views = objet.vues
      const hashtags = (objet.description ?? '').match(/#\w+/g) ?? []

      for (const hashtag of hashtags) {
        if (totals[hashtag]) {
          totals[hashtag].likes += likes
          totals[hashtag].shares += shares
          totals[hashtag].comments += comments
          totals[hashtag].views += views
          totals[hashtag].count++
        } else {
          totals[hashtag] = {
            hashtag: hashtag,
            likes: likes,
            shares: shares,
            comments: comments,
            views: views,
            count: 1
          }
        }
      }
    }
  })

  const averages = Object.values(totals).map((hashtagStats) => {
    const averageLikes = hashtagStats.likes / hashtagStats.count
    const averageShares = hashtagStats.shares / hashtagStats.count
    const averageComments = hashtagStats.comments / hashtagStats.count
    const averageViews = hashtagStats.views / hashtagStats.count
    return {
      hashtag: hashtagStats.hashtag,
      likes: hashtagStats.likes,
      partages: hashtagStats.shares,
      commentaires: hashtagStats.comments,
      vues: hashtagStats.views,
      moyenneLikes: averageLikes,
      moyennePartages: averageShares,
      moyenneCommentaires: averageComments,
      moyenneVues: averageViews
    }
  })

  return averages
}
