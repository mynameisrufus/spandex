$ = jQuery

$.fn.spandex = (method) ->

  _method = (method) =>
    if methods[method]
      methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ))
    else if ( typeof method == 'object' || typeof method == 'string' || ! method )
      methods.init.apply( this, arguments )
    else
      $.error( "Method #{method} does not exist on jQuery.spandex" )

  safe = $.browser.msie && $.browser.version <= 7

  calculate =
    # Calculate the new dimensions of the image based on the bounding
    # height and width.
    image: (bw, bh, ow, oh, min) ->

      # Stub bounding height and width if less than specified min height
      # and width.
      bw = min.width if bw <= min.width
      bh = min.height if bh <= min.height

      # Calculate the image ratio by dividing the original width by the
      # original height.
      r = ow / oh

      # If the bounding width divided by the ratio is greater than the
      # bounding height we scale and clip y, if not we scale and clip x.
      if ( bw / r ) > bh
        nw = bw
        nh = ( bw / ow ) * oh
        ot = ( ( bw / r ) - bh ) / 2
        ol = 0
        s  = bw / ow
      else
        nh = bh
        nw = ( bh / oh ) * ow
        ot = 0
        ol = ( nw - bw ) / 2
        s  = bh / oh

      width: nw, height: nh, top: ot, left: ol, ratio: r, scale: s

    # Calculate the new dimensions of the wrapper based on the bounding
    # height and width clipping the dimensions if specified.
    wrapper: (bw, bh, clip, min) ->

      nw = bw - (clip.right + clip.left)
      nw = min.width if nw <= min.width

      nh = bh - (clip.bottom + clip.top)
      nh = min.height if nh <= min.height

      width: nw, height: nh, top: clip.top, left: clip.left

  # Stretch callback function using with window or bounding element
  # `resize` event.
  stretch = ($wrapper, $image, options) =>

    boundingWidth  = if options.wrapper.fullscreen then $(window).width() else @width()
    boundingHeight = if options.wrapper.fullscreen then $(window).height() else @height()

    wrapper = calculate.wrapper boundingWidth,
                                boundingHeight,
                                options.wrapper.clip,
                                options.wrapper.min

    $wrapper.css wrapper

    # Use the wrapper width and height because the wrapper my have been
    # clipped.
    image = calculate.image wrapper.width,
                            wrapper.height,
                            options.image.width,
                            options.image.height,
                            options.image.min

    # Temporary css options object for image
    _image =
      top: 0
      left: 0
      width: image.width
      height: image.height

    # center the image if specified.
    _image.top  = "-#{image.top}px" if options.image.centered.y
    _image.left = "-#{image.left}px" if options.image.centered.x

    $image.css _image

    @trigger 'stretch', { wrapper: wrapper, image: image }

  appendWrapper = (index, el, options) ->
    $(el).find('div.spandex').remove()
    $wrapper = $ '<div class="spandex"/>'
    $wrapper.css options.wrapper.css
    $wrapper.data 'spandex', options
    $(el).append $wrapper

  appendImage = (index, el, src, callback) =>
    $wrapper = $(el).find 'div.spandex'
    _options = $wrapper.data 'spandex'
    $image   = $("<img />").css _options.image.css

    loadCallback = =>
      $wrapper.find('img').fadeOut _options.speed, ->
        $(this).remove()
      $wrapper.append $image

      # store the original width and height of the image before we alter
      # it.
      _options.image.width  = $image.width()
      _options.image.height = $image.height()
      _options.image.src    = src

      $wrapper.data 'spandex', _options

      $image.fadeIn _options.speed

      stretchCallback = ->
        func = ->
          stretch $wrapper, $image, _options
        if safe
          try
            func()
          catch e
            # nothing
        else
          func()

      stretchCallback()

      @trigger 'change', $image

      callback.apply @, $image if callback

      $(window).on "resize", stretchCallback

      @one 'destroy', =>
        @unbind '.spandex'
        $(window).off "resize", stretchCallback
        clearTimeout $wrapper.data('spandex.timeout')
        $wrapper.remove()

    deferWrap = ->
      clearTimeout $wrapper.data('spandex.timeout')
      unless _options.defer == 0
        id = setTimeout loadCallback, _options.defer
        $wrapper.data 'spandex.timeout', id
      else
        loadCallback()

    $image.one('load', deferWrap).attr('src', src).each ->
      $(@).load() if @complete

  methods =
    init: (options, src, callback) ->

      _options = $.extend {
        speed: 0
        defer: 0
      }, options

      _options.wrapper = $.extend true, {
        fullscreen: true
        min:
          width : 0
          height: 0
        clip:
          top: 0
          bottom: 0
          left: 0
          right: 0
        css:
          left      : 0
          top       : 0
          position  : "fixed"
          overflow  : "hidden"
          zIndex    : -999999
          margin    : 0
          padding   : 0
          height    : "100%"
          width     : "100%"
      }, options.wrapper

      _options.image = $.extend true, {
        centered:
          x: true
          y: true
        min:
          width: 0
          height: 0
        css:
          position: "absolute"
          display: "none"
          margin: 0
          padding: 0
          border: "none"
          zIndex: -999999
          maxWidth: "none"
          maxHeight: "none"
      }, options.image

      @each (index, el) ->
        appendWrapper index, el, _options

      if typeof arguments[0] == "string"
        _method 'use', arguments[0], arguments[1]
      else if typeof arguments[1] == "string"
        _method 'use', arguments[1], arguments[2]
      else
        @

    destroy: ->
      @trigger 'destroy'

    stretch: ->
      $(@).resize()

    use: (src, callback) ->
      @each (index, el) =>
        appendImage index, el, src, callback

  _method.apply @, arguments
