###!
# Utility
# Some helpers
# http://lagden.github.io/modal-layout
# MIT license
###

### global define ###

((window, factory) ->
  'use strict'
  if typeof define == 'function' and define.amd
    define factory
  else if typeof exports == 'object'
    module.exports = factory()
  else
    window.utility = factory()
  return
) window, ->

  detect = (lista, d) ->
    while lista.length
      item = lista.shift()
      if d.documentElement.style[item[0]] != undefined
        return item
    lista[0]

  transitionEvent = (d) ->
    VENDOR = [
      [
        'transition'
        'transitionend'
      ]
      [
        'MozTransition'
        'mozTransitionEnd'
      ]
      [
        'OTransition'
        'oTransitionEnd'
      ]
      [
        'webkitTransition'
        'webkitTransitionEnd'
      ]
    ]
    detect(VENDOR, d)[1]

  ### Animation
  # 1 = Start
  # 2 = Iteration
  # 3 = End
  ###

  animationEvent = (d) ->
    VENDOR = [
      [
        'animation'
        'animationstart'
        'animationiteration'
        'animationend'
      ]
      [
        'MozAnimation'
        'mozAnimationStart'
        'mozAnimationIteration'
        'mozAnimationEnd'
      ]
      [
        'OAnimation'
        'oAnimationStart'
        'oAnimationIteration'
        'oAnimationEnd'
      ]
      [
        'webkitAnimation'
        'webkitAnimationStart'
        'webkitAnimationIteration'
        'webkitAnimationEnd'
      ]
    ]
    detect VENDOR, d

  objectAssign = (a, b) ->
    for prop of b
      a[prop] = b[prop]
    a

  isElement = (v) ->
    if typeof HTMLElement is 'object'
      v instanceof HTMLElement
    else
      v and
      typeof v is 'object' and
      v.nodeType is 1 and
      typeof v.nodeName is 'string'

  'transitionEvent': transitionEvent
  'animationEvent': animationEvent
  'objectAssign': objectAssign
  'isElement': isElement
