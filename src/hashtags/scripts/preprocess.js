/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/check-param-names */

/**
 * Returns the list of the most popular hashtags with fromTo dates
 *
 * @param {object[]} data The data to analyze
 * @returns {object[]} The column with the normalized data
 */
export function regrouperParHashtags (data, fromToDates) {
  const groupes = {}

  data.forEach((objet) => {
    if (new Date(objet.date).getTime() >= fromToDates.from.getTime() &&
    new Date(objet.date).getTime() <= fromToDates.to.getTime()) {
      const likes = objet.likes
      const partages = objet.partages
      const commentaires = objet.commentaires
      const vues = objet.vues
      const hashtags = (objet.description ?? '').match(/#\w+/g) ?? []

      for (const hashtag of hashtags) {
        if (groupes[hashtag]) {
          groupes[hashtag].likes += likes
          groupes[hashtag].partages += partages
          groupes[hashtag].commentaires += commentaires
          groupes[hashtag].vues += vues
          groupes[hashtag].count++
        } else {
          groupes[hashtag] = {
            hashtag: hashtag,
            likes: likes,
            partages: partages,
            commentaires: commentaires,
            vues: vues,
            count: 1
          }
        }
      }
    }
  })

  const nouveauTableau = Object.values(groupes).map((groupe) => {
    const moyenneLikes = groupe.likes / groupe.count
    const moyennePartages = groupe.partages / groupe.count
    const moyenneCommentaires = groupe.commentaires / groupe.count
    const moyenneVues = groupe.vues / groupe.count
    return {
      hashtag: groupe.hashtag,
      likes: moyenneLikes,
      partages: moyennePartages,
      commentaires: moyenneCommentaires,
      vues: moyenneVues
    }
  })

  return nouveauTableau
}
