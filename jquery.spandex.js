(function( $ ){
  $.fn.spandex = function( method ) {

    var methods = {

      init: function( options ) {
        var bodyChild = {
          left: 0,
          top: 0,
          position: "fixed",
          overflow: "hidden",
          zIndex: -999999,
          margin: 0,
          padding: 0,
          height: "100%",
          width: "100%"
        };

        this.each(function(){
          $this = $(this);
          $this.data("spandex", $.extend( {
            speed    : 0,
            centeredX: true,
            centeredY: true
          }, options));
          if (options.change) $this.bind('change', options.change);
          if (options.stretch) $this.bind('stretch', options.stretch);
          if ($this.parent()[0] == document.body) {
            $(function() {
              $this.css(bodyChild);
            });
          };
        });

        if (options.use) {
          return methods["use"].call( this, options.use );
        };

        return this;
      },
      
      destroy: function() {
        $(window).unbind('.spandex');
        return this.each(function(){
          $(this).find('img.spandex').remove();
        });
      },

      use: function(src, callback) {

        var rootElement = ("onorientationchange" in window) ? $(document) : $(window);

        return this.each(function(){
          var $this, settings, load;
          silentFail = ($.browser.msie && $.browser.version <= 7);
          $this = $(this);
          settings = $this.data("spandex");

          load = function(e) {

            $this.trigger('change', src);

            var $img = $(this), imgWidth, imgHeight;
            $img.css({width: "auto", height: "auto"});
            imgWidth = this.width || $(e.target).width();
            imgHeight = this.height || $(e.target).height();
            imgRatio = imgWidth / imgHeight;

            resize = function() {
              bgCSS = {left: 0, top: 0}

              width = function() {
                if (settings.minWidth) {
                  return (rootElement.width() >= settings.minWidth) ? rootElement.width() : settings.minWidth;
                } else {
                  return rootElement.width()
                }
              };

              bgWidth = width();
              bgHeight = bgWidth / imgRatio;
              var bgOffsetTop, bgOffsetLeft; 
              if(bgHeight >= rootElement.height()) {
                var bgOffsetTop = (bgHeight - rootElement.height()) /2;
                if(settings.centeredY) $.extend(bgCSS, {top: "-" + bgOffsetTop + "px"});
              } else {
                var bgHeight = rootElement.height();
                var bgWidth = bgHeight * imgRatio;
                var bgOffsetLeft = (bgWidth - rootElement.width()) / 2;
                if(settings.centeredX) $.extend(bgCSS, {left: "-" + bgOffsetLeft + "px"});
              }
              $this.width( bgWidth ).height( bgHeight )
              $img.css($.extend(bgCSS, {width: bgWidth, height: bgHeight}));

              values = {
                width: bgWidth,
                height: bgHeight,
                ratio: imgRatio,
                offsetTop: (bgOffsetTop || 0),
                offsetLeft: (bgOffsetLeft || 0),
                scale: (((bgWidth / imgWidth) + (bgHeight / imgHeight)) / 2),
                image: {
                  width: imgWidth,
                  height: imgHeight,
                  src: src
                }
              };

              $this.trigger('stretch', values);
            };

            resizeCallback = function () {
              if (silentFail) {
                resize();
              } else {
                try {
                  resize();
                } catch(e) {

                }
              }
            }
            $(window).bind('resize.spandex', resizeCallback);
            $(function() {
              resizeCallback();
              $img.fadeIn(settings.speed);
            });
          };

          var options = {
            position: "absolute",
            display: "none",
            margin: 0,
            padding: 0,
            border: "none",
            zIndex: -999999
          };

          $this.find('img.spandex').fadeOut(settings.speed, function() {
            $(this).remove();
          });

          $("<img />").css(options)
                      .bind("load", load)
                      .appendTo($this)
                      .attr("class", "spandex")
                      .attr("src", src);
        });
      }
    };
    
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.spandex' );
    }
  };
})( jQuery );
