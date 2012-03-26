$ = jQuery

$.fn.spandex = (method) ->
  methods =
    init: (options) ->
      @each ->
        $wrapper = $ '<div class="spandex"/>'

        $wrapper.css $.extend {
          left     : 0
          top      : 0
          position : "fixed"
          overflow : "hidden"
          zIndex   : -999999
          margin   : 0
          padding  : 0
          height   : "100%"
          width    : "100%"
        }, options.wrapper

        delete options.wrapper

        $wrapper.data 'spandex', $.extend {
          speed    : 0
          centeredX: true
          centeredY: true
        }, options

        $(@).prepend($wrapper).
          bind('change.spandex', options.change).
          bind('stretch.spandex', options.stretch)

      if options.use
        methods.use.call @, options.use
      else
        @

    use: (src, callback) ->

      stretch = ($wrapper, $image, options) =>


      @each (index, el) =>
        $wrapper = $(@).find '.spandex'

        options = $wrapper.data 'spandex'

        $image   = $("<img />").css
          position: "absolute",
          display: "none",
          margin: 0,
          padding: 0,
          border: "none",
          zIndex: -999999

        $wrapper.find('img').fadeOut options.speed, ->
          $(this).remove()
        $wrapper.append $image
        $image.fadeIn options.speed

        $image.on 'load', =>
          @trigger 'change', $image
          callback.call @, $image, values if callback

        $image.on 'load', ->
          stretch $wrapper, $image, options

        $(window).on 'resize.spandex', ->
          stretch $wrapper, $image

        $image.attr 'src', src

      #   $this.find('img.spandex').fadeOut settings.speed, ->
      #     $(this).remove()

      #   $("<img />").css(options)
      #               .bind("load", load)
      #               .appendTo($this)
      #               .attr("class", "spandex")
      #               .attr("src", src)
      # rootElement = if ("onorientationchange" in window) then $(document) else $(window)

      # @each ->
      #   silentFail = $.browser.msie && $.browser.version <= 7
      #   $this = $(@)
      #   settings = $this.data("spandex")

      #   load = (e) ->

      #     $this.trigger('change', src)

      #     $img = $(this)
      #     $img.css({width: "auto", height: "auto"})
      #     imgWidth = this.width || $(e.target).width()
      #     imgHeight = this.height || $(e.target).height()
      #     imgRatio = imgWidth / imgHeight

      #     resize = ->
      #       bgCSS = {left: 0, top: 0}

      #       width = ->
      #         if (settings.minWidth)
      #           if (rootElement.width() >= settings.minWidth) then rootElement.width() else settings.minWidth
      #         else
      #           rootElement.width()

      #       bgWidth = width()
      #       bgHeight = bgWidth / imgRatio
      #       if bgHeight >= rootElement.height()
      #         bgOffsetTop = (bgHeight - rootElement.height()) /2
      #         if settings.centeredY
      #           $.extend(bgCSS, {top: "-" + bgOffsetTop + "px"})
      #       else
      #         bgHeight = rootElement.height()
      #         bgWidth = bgHeight * imgRatio
      #         bgOffsetLeft = (bgWidth - rootElement.width()) / 2
      #         if settings.centeredX
      #           $.extend(bgCSS, {left: "-" + bgOffsetLeft + "px"})

      #       $this.width( bgWidth ).height( bgHeight )
      #       $img.css($.extend(bgCSS, {width: bgWidth, height: bgHeight}))

      #       values = {
      #         width: bgWidth,
      #         height: bgHeight,
      #         ratio: imgRatio,
      #         offsetTop: (bgOffsetTop || 0),
      #         offsetLeft: (bgOffsetLeft || 0),
      #         scale: (((bgWidth / imgWidth) + (bgHeight / imgHeight)) / 2),
      #         image: {
      #           width: imgWidth,
      #           height: imgHeight,
      #           src: src
      #         }
      #       }

      #       $this.trigger('stretch', values)

      #     resizeCallback = ->
      #       if silentFail
      #         resize()
      #       else
      #         try
      #           resize()
      #         catch e
      #           #nothing

      #     $(window).bind('resize.spandex', resizeCallback)
      #     $ ->
      #       resizeCallback()
      #       $img.fadeIn(settings.speed)

      #   options = {
      #     position: "absolute",
      #     display: "none",
      #     margin: 0,
      #     padding: 0,
      #     border: "none",
      #     zIndex: -999999
      #   }

      #   $this.find('img.spandex').fadeOut settings.speed, ->
      #     $(this).remove()

      #   $("<img />").css(options)
      #               .bind("load", load)
      #               .appendTo($this)
      #               .attr("class", "spandex")
      #               .attr("src", src)
    destroy: ->
      $(window).off '.spandex'
      @each ->
        $(@).find('.spandex').remove()


  if methods[method]
    methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ))
  else if ( typeof method == 'object' || ! method )
    methods.init.apply( this, arguments )
  else
    $.error( "Method #{method} does not exist on jQuery.spandex" )
