'use strict'

define [
  'components/modal'
], (Modal) ->

  qS = document.querySelector.bind document

  # Buttons
  btnOpen = qS '#btnModalOpen'
  btnDestroy = qS '#btnModalDestroy'

  # Modal Content
  modalContent = qS '#modalContent'

  # Modal
  modal = new Modal modalContent

  # Modal Events
  modal.on 'open', (instance)->
    console.log 'modal opened', instance
    return

  modal.on 'close', ->
    console.log 'modal closed'
    return

  modal.on 'destroy', ->
    console.log 'modal destroyed'
    return

  openModal = ->
    modal.open()
    return

  closeModal = ->
    modal.close()
    return

  destroyModal = ->
    modalContent.removeEventListener 'click', closeModal
    btnOpen.removeEventListener 'click', openModal
    btnDestroy.removeEventListener 'click', destroyModal
    modal.destroy()
    return

  modalContent.addEventListener 'click', closeModal
  btnOpen.addEventListener 'click', openModal
  btnDestroy.addEventListener 'click', destroyModal

  return
