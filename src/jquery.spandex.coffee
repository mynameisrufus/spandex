$ = jQuery

$.fn.spandex = (method) ->

  safe = $.browser.msie && $.browser.version <= 7

  calculate = (bw, bh, ow, oh) ->
    # bw: bounding width
    # bh: bounding height
    # ow: original width
    # oh: original height
    # r : ratio
    # nw: new width
    # nh: new height
    # ot: offset top
    # ol: offset left

    r = ow / oh

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

    width: Math.ceil(nw), height: Math.ceil(nh), top: ot, left: ol, ratio: r, scale: s

  stretch = ($wrapper, $image, options) =>

    x = if options.fullscreen then $(window).width() else @width()
    x = x - (options.offset.left + options.offset.right)

    y = if options.fullscreen then $(window).height() else @height()
    y = y - (options.offset.top + options.offset.bottom)

    width  = x
    height = y

    $wrapper.css $.extend {
      height: height
      width: width
    }, options.offset

    ix = if (width >= options.min.width) then width else options.min.width
    iy = if (height >= options.min.height) then height else options.min.height

    calc = calculate ix, iy, options.image.width, options.image.height
    css  = top: 0, left: 0, width: calc.width, height: calc.height

    if options.centeredY
      css.top = "-#{calc.top}px"
    if options.centeredX
      css.left = "-#{calc.left}px"

    $image.css css

    @trigger 'stretch',
      wrapper:
        height: height
        width: width
        offset: options.offset
      image:
         height: calc.width
         width: calc.height
         offset:
           top: calc.top
           left: calc.left
         ratio: calc.ratio
         scale: calc.scale

  methods =
    init: (options) ->
      @each ->
        $wrapper = $ '<div class="spandex"/>'

        $wrapper.css $.extend {
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

        _options = $.extend {
          speed     : 0
          centeredX : true
          centeredY : true
          defer: 0
          fullscreen: true
        }, options

        _options.min = $.extend {
          width: 0
          height: 0
        }, options.min

        _options.offset = $.extend {
          top: 0
          bottom: 0
          left: 0
          right: 0
        }, options.offset

        $wrapper.data 'spandex', _options

        $(@).append($wrapper).
          bind('change.spandex', options.change).
          bind('stretch.spandex', options.stretch)

      if options.use
        methods.use.call @, options.use
      else
        @
    
    destroy: ->
      @trigger 'destroy'

    stretch: ->
      $(@).resize()

    use: (src, callback) ->
      @each (index, el) =>
        $wrapper = $(el).find '.spandex'

        options  = $wrapper.data 'spandex'

        $image   = $("<img />").css
          position: "absolute",
          display: "none",
          margin: 0,
          padding: 0,
          border: "none",
          zIndex: -999999

        loadCallback = =>
          $wrapper.find('img').fadeOut options.speed, ->
            $(this).remove()

          $wrapper.append $image
          # iOS needs a wait for the animation to work
          $image.fadeIn options.speed

          options.image =
            width: $image.width()
            height: $image.height()

          $wrapper.data 'spandex', options

          stretchCallback = ->
            func = ->
              stretch $wrapper, $image, options
            if safe
              try
                func()
              catch e
                # nothing
            else
              func()

          stretchCallback()

          @trigger 'change', $image

          callback.call @, $image, values if callback

          $(window).on "resize", stretchCallback

          @one 'destroy', =>
            @unbind '.spandex'
            $(window).off "resize", stretchCallback
            $wrapper.remove()

        deferWrap = ->
          clearTimeout $wrapper.data('spandex.timeout')
          unless options.defer == 0
            id = setTimeout loadCallback, options.defer
            $wrapper.data 'spandex.timeout', id
          else
            loadCallback()

        $image.one('load', deferWrap).attr('src', src).each ->
          $(@).load() if @complete


  if methods[method]
    methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ))
  else if ( typeof method == 'object' || ! method )
    methods.init.apply( this, arguments )
  else
    $.error( "Method #{method} does not exist on jQuery.spandex" )
