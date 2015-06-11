'use strict'

define [
  'components/modal'
], (Modal) ->

  modal = new Modal

  btnOpen = document.querySelector '#btnModalOpen'
  btnClose = document.querySelector '#btnModalClose'

  btnOpen.addEventListener 'click', () ->
    modal.open()
    return

  btnClose.addEventListener 'click', () ->
    modal.close()
    return

  return
