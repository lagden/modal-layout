((window, factory) ->

  'use strict'

  if typeof define == 'function' and define.amd
    define [ './lib/util' ], (utility) ->
      factory window, utility
  else if typeof exports == 'object'
    module.exports = factory window, require('./lib/util')
  else
    window.modalLayout = factory(window, window.utility)
  return

) window, (window, utility) ->

   # Globally unique identifiers
  GUID = 0

  doc = window.document
  transitionEnd = utility.transitionEvent doc
  docBody = doc.body || doc.querySelector 'body'
  head = doc.head || doc.getElementsByTagName('head')[0]

  class Modal
    constructor: (opts) ->

      @id = ++GUID

      @opts =
        esc: true
        beforeOpen: null
        prefix: 'modalLayout'
        overlay: 'modalLayout__overlay'
        box: 'modalLayout__box'
        content: 'xxx'
      utility.objectAssign @opts, opts

      @modalOpen = "#{@opts.prefix}-#{@id}--open"

      contentIsStr = false

      if utility.isElement @opts.content
        @content = @opts.content
      else
        if typeof @opts.content == 'string'
          @content = doc.querySelector @opts.content
          if @content is null
            @content = @opts.content
            contentIsStr = true

      # Template
      r =
        id: @id
        overlay: @opts.overlay
        box: @opts.box
        content: if contentIsStr then @content else ''

      render = @template().replace /\{(.*?)\}/g, (a, b) -> r[b]
      docBody.insertAdjacentHTML 'beforeend', render

      # Elements
      @overlay = doc.querySelector "#modalLayoutOverLay#{@id}"
      @box = doc.querySelector "#modalLayoutBox#{@id}"

      # Move content
      @box.appendChild @content if contentIsStr is false

      # Keyboard
      @keyCodes = esc: 27

      # Listeners
      if @opts.esc is true
        @box.addEventListener 'keyup', @, false

      @_style()

    template: ->
      [
        '<div id="modalLayoutOverLay{id}" class="{overlay}"></div>'
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
      @overlay.classList[m] "#{@opts.overlay}--open"
      return

    open: ->
      if @isOpen() is false
        if typeof @opts.beforeOpen == 'function'
          @opts.beforeOpen @box, @overlay
        @_toogle 'add'
        @box.focus()
      return

    close: ->
      @_toogle 'remove' if @isOpen() is true
      return

    destroy: ->
      head.removeChild @styl
      if @opts.esc is true
        @box.removeEventListener 'keyup', @, false
      docBody.removeChild @box
      docBody.removeChild @overlay
      return

    handleEvent: (event) ->
      switch event.type
        when 'keyup' then @onKeyUp event
      return
