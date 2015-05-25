'use strict'

define [
  'templates/sample'
], (template) ->

  qS = document.querySelector.bind document

  $info = qS '#info'
  $info.insertAdjacentHTML 'afterbegin', template
    name: navigator.appName
    version: navigator.appVersion

  return
