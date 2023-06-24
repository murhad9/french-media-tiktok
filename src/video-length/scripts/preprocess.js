export function groupByDuration (data) {
  const groupes = {}

  data.forEach((objet) => {
    const duréeSecondes = objet.duréeSecondes
    const likes = objet.likes
    const partages = objet.partages
    const commentaires = objet.commentaires
    const vues = objet.vues

    if (groupes[duréeSecondes]) {
      groupes[duréeSecondes].likes += likes
      groupes[duréeSecondes].partages += partages
      groupes[duréeSecondes].commentaires += commentaires
      groupes[duréeSecondes].vues += vues
      groupes[duréeSecondes].count++
    } else {
      groupes[duréeSecondes] = {
        duréeSecondes: duréeSecondes,
        likes: likes,
        partages: partages,
        commentaires: commentaires,
        vues: vues,
        count: 1
      }
    }
  })

  const nouveauTableau = Object.values(groupes).map((groupe) => {
    const moyenneLikes = groupe.likes / groupe.count
    const moyennePartages = groupe.partages / groupe.count
    const moyenneCommentaires = groupe.commentaires / groupe.count
    const moyenneVues = groupe.vues / groupe.count
    return {
      duréeSecondes: groupe.duréeSecondes,
      likes: moyenneLikes,
      partages: moyennePartages,
      commentaires: moyenneCommentaires,
      vues: moyenneVues
    }
  })

  return nouveauTableau
}

export function topTenIdealVideo (data) {
  const tab = []
  let init = 0
  for (let index = 0; index < 25; index++) {
    const temp = {
      intervalle1: init,
      intervalle2: init + 25,
      likes: 0,
      partages: 0,
      commentaires: 0,
      vues: 0,
      count: 0
    }
    init += 25
    tab.push(temp)
  }

  const newData = groupByDuration(data)

  newData.forEach((objet) => {
    for (const el of tab) {
      if (el.intervalle1 <= objet.duréeSecondes && el.intervalle2 > objet.duréeSecondes) {
        el.likes += objet.likes
        el.partages += objet.partages
        el.commentaires += objet.commentaires
        el.vues += objet.vues
        el.count++
      }
    }
  })

  tab.forEach((objet) => {
    objet.likes = objet.likes / objet.count
    objet.partages = objet.partages / objet.count
    objet.commentaires = objet.commentaires / objet.count
    objet.vues = objet.vues / objet.count
  })

  return tab
}
