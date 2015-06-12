((window, factory) ->

  'use strict'

  if typeof define == 'function' and define.amd
    define [
      'eventEmitter/EventEmitter'
      './lib/util'
    ], (EventEmitter, utility) ->
      factory window, EventEmitter, utility
  else if typeof exports == 'object'
    module.exports = factory window,
                             require('wolfy87-eventemitter'),
                             require('./lib/util')
  else
    window.modalLayout = factory window,
                                 window.EventEmitter,
                                 window.utility
  return

) window, (window, EventEmitter, utility) ->

  # Globally unique identifiers
  GUID = 0

  doc = window.document
  head = doc.head || doc.getElementsByTagName('head')[0]
  docBody = doc.body || doc.querySelector 'body'

  class Modal extends EventEmitter
    constructor: (opts) ->

      @id = ++GUID

      # Options
      @opts =
        esc: true
        beforeOpen: null
        prefix: 'modalLayout'
        content: ''
        escape: false
      utility.objectAssign @opts, opts
      @opts.box = "#{@opts.prefix}__box"

      # Content
      @content = @opts.content
      if utility.isElement @content
        contentIsStr = false
      else if typeof @content == 'string' and @content isnt ''
        contentIsStr = true
        @content = utility.escapeHtml @content if @opts.escape
      else
        throw 'content must be a HTMLElement or string'

      # Template
      r =
        id: @id
        box: @opts.box
        content: if contentIsStr then @content else ''

      render = @template().replace /\{(.*?)\}/g, (a, b) -> r[b]
      docBody.insertAdjacentHTML 'beforeend', render

      # Elements
      @box = doc.querySelector "#modalLayoutBox#{@id}"

      # Move content
      @box.appendChild @content if contentIsStr is false

      # Keyboard
      @keyCodes = esc: 27

      # Listeners
      if @opts.esc is true
        @box.addEventListener 'keyup', @, false

      # Style
      @modalOpen = "#{@opts.prefix}-#{@id}--open"
      @_style()

    _style: ->
      css = ".#{@modalOpen}{overflow: hidden;}"
      @styl = doc.createElement 'style'
      @styl.type = 'text/css'

      if @styl.styleSheet
        @styl.styleSheet.cssText = css
      else
        @styl.appendChild doc.createTextNode(css)

      head.appendChild @styl
      return

    _toogle: (m) ->
      docBody.classList[m] @modalOpen
      @box.classList[m] "#{@opts.box}--open"
      return

    template: ->
      [
        '<div id="modalLayoutBox{id}" tabindex="0" class="{box}">'
        '{content}'
        '</div>'
      ].join ''

    onKeyUp: (event) ->
      if event.keyCode == @keyCodes.esc
        @close()
      return

    isOpen: ->
      docBody.classList.contains @modalOpen

    open: ->
      if @isOpen() is false
        if typeof @opts.beforeOpen == 'function'
          @opts.beforeOpen @, @box
        @_toogle 'add'
        @box.focus()
        @emitEvent 'open'
      return

    close: ->
      if @isOpen() is true
        @_toogle 'remove'
        @emitEvent 'close'
      return

    destroy: ->
      head.removeChild @styl
      if @opts.esc is true
        @box.removeEventListener 'keyup', @, false
      docBody.removeChild @box
      @emitEvent 'destroy'
      return

    handleEvent: (event) ->
      switch event.type
        when 'keyup' then @onKeyUp event
      return
