/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-vars */
'use strict'

import * as overview from './overview/index.js'
import * as hashtags from './hashtags/index.js'
import * as videoLength from './video-length/index.js'
import * as songs from './songs/index.js'
import * as videoPosting from './video-posting/index.js'

/**
 * @file This file is the entry-point for the the code for the data viz project of team 10
 * @author Team 10
 * @version v1.0.0
 */

(function (d3) {
  const tabContents = document.getElementsByClassName('tab-content')
  Array.from(tabContents).forEach(tab => {
    tab.style.display = 'none'
  })

  overview.load(d3)

  videoLength.load(d3)
  hashtags.load(d3)
  songs.load(d3)
  videoPosting.load(d3)

  // default tab
  document.getElementById('overview').style.display = 'block'
  document.getElementById('overview-tab').style.background = '#ffffff11'

  addClickEvent('overview-tab', 'overview')
  addClickEvent('hashtags-tab', 'hashtags')
  addClickEvent('video-length-tab', 'video-length')
  addClickEvent('songs-tab', 'songs')
  addClickEvent('video-posting-tab', 'video-posting')

  /**
   * Displays the tab with the corresponding id
   *
   * @param {*} id The id of the tab to display
   */
  function displayTab (id) {
    Array.from(tabContents).forEach(tab => {
      tab.style.display = 'none'
    })

    document.getElementById(id).style.display = 'block'
    window.dispatchEvent(new Event('resize'))
  }

  function addClickEvent (tabID, divID) {
    document.getElementById(tabID).addEventListener('click', () => {
      displayTab(divID)
      resetStyles()
      document.getElementById(tabID).style.background = '#ffffff11'
    })
  }

  function resetStyles () {
    document.getElementById('overview-tab').style.background = ''
    document.getElementById('hashtags-tab').style.background = ''
    document.getElementById('video-length-tab').style.background = ''
    document.getElementById('songs-tab').style.background = ''
    document.getElementById('video-posting-tab').style.background = ''
  }
})(d3)
