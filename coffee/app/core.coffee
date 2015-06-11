'use strict'

define [
  'components/modal'
], (Modal) ->

  modal = new Modal content: 'xyz'

  btnOpen = document.querySelector '#btnModalOpen'
  btnClose = document.querySelector '#btnModalClose'
  btnDestroy = document.querySelector '#btnModalDestroy'

  btnOpen.addEventListener 'click', () ->
    modal.open()
    return

  btnClose.addEventListener 'click', () ->
    modal.close()
    return

  btnDestroy.addEventListener 'click', () ->
    modal.destroy()
    return

  return
