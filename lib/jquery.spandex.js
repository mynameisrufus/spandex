(function() {
  var $;

  $ = jQuery;

  $.fn.spandex = function(method) {
    var calculate, methods, safe, stretch,
      _this = this;
    safe = $.browser.msie && $.browser.version <= 7;
    calculate = function(bw, bh, ow, oh) {
      var nh, nw, ol, ot, r, s;
      r = ow / oh;
      if ((bw / r) > bh) {
        nw = bw;
        nh = (bw / ow) * oh;
        ot = ((bw / r) - bh) / 2;
        ol = 0;
        s = bw / ow;
      } else {
        nh = bh;
        nw = (bh / oh) * ow;
        ot = 0;
        ol = (nw - bw) / 2;
        s = bh / oh;
      }
      return {
        width: Math.ceil(nw),
        height: Math.ceil(nh),
        top: ot,
        left: ol,
        ratio: r,
        scale: s
      };
    };
    stretch = function($wrapper, $image, options) {
      var calc, css, height, ix, iy, width, x, y;
      x = options.fullscreen ? $(window).width() : _this.width();
      x = x - (options.offset.left + options.offset.right);
      y = options.fullscreen ? $(window).height() : _this.height();
      y = y - (options.offset.top + options.offset.bottom);
      width = x;
      height = y;
      $wrapper.css($.extend({
        height: height,
        width: width
      }, options.offset));
      ix = width >= options.min.width ? width : options.min.width;
      iy = height >= options.min.height ? height : options.min.height;
      calc = calculate(ix, iy, options.image.width, options.image.height);
      css = {
        top: 0,
        left: 0,
        width: calc.width,
        height: calc.height
      };
      if (options.centeredY) css.top = "-" + calc.top + "px";
      if (options.centeredX) css.left = "-" + calc.left + "px";
      $image.css(css);
      return _this.trigger('stretch', {
        wrapper: {
          height: height,
          width: width,
          offset: options.offset
        },
        image: {
          height: calc.width,
          width: calc.height,
          offset: {
            top: calc.top,
            left: calc.left
          },
          ratio: calc.ratio,
          scale: calc.scale
        }
      });
    };
    methods = {
      init: function(options) {
        this.each(function() {
          var $wrapper, _options;
          $wrapper = $('<div class="spandex"/>');
          $wrapper.css($.extend({
            left: 0,
            top: 0,
            position: "fixed",
            overflow: "hidden",
            zIndex: -999999,
            margin: 0,
            padding: 0,
            height: "100%",
            width: "100%"
          }, options.wrapper));
          _options = $.extend({
            speed: 0,
            centeredX: true,
            centeredY: true,
            defer: 0,
            fullscreen: true
          }, options);
          _options.min = $.extend({
            width: 0,
            height: 0
          }, options.min);
          _options.offset = $.extend({
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }, options.offset);
          $wrapper.data('spandex', _options);
          return $(this).append($wrapper).bind('change.spandex', options.change).bind('stretch.spandex', options.stretch);
        });
        if (options.use) {
          return methods.use.call(this, options.use);
        } else {
          return this;
        }
      },
      destroy: function() {
        return this.trigger('destroy');
      },
      stretch: function() {
        return $(this).resize();
      },
      use: function(src, callback) {
        var _this = this;
        return this.each(function(index, el) {
          var $image, $wrapper, deferWrap, loadCallback, options;
          $wrapper = $(el).find('.spandex');
          options = $wrapper.data('spandex');
          $image = $("<img />").css({
            position: "absolute",
            display: "none",
            margin: 0,
            padding: 0,
            border: "none",
            zIndex: -999999
          });
          loadCallback = function() {
            var stretchCallback;
            $wrapper.find('img').fadeOut(options.speed, function() {
              return $(this).remove();
            });
            $wrapper.append($image);
            $image.fadeIn(options.speed);
            options.image = {
              width: $image.width(),
              height: $image.height()
            };
            $wrapper.data('spandex', options);
            stretchCallback = function() {
              var func;
              func = function() {
                return stretch($wrapper, $image, options);
              };
              if (safe) {
                try {
                  return func();
                } catch (e) {

                }
              } else {
                return func();
              }
            };
            stretchCallback();
            _this.trigger('change', $image);
            if (callback) callback.call(_this, $image, values);
            $(window).on("resize", stretchCallback);
            return _this.one('destroy', function() {
              _this.unbind('.spandex');
              $(window).off("resize", stretchCallback);
              return $wrapper.remove();
            });
          };
          deferWrap = function() {
            var id;
            clearTimeout($wrapper.data('spandex.timeout'));
            if (options.defer !== 0) {
              id = setTimeout(loadCallback, options.defer);
              return $wrapper.data('spandex.timeout', id);
            } else {
              return loadCallback();
            }
          };
          return $image.one('load', deferWrap).attr('src', src).each(function() {
            if (this.complete) return $(this).load();
          });
        });
      }
    };
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      return $.error("Method " + method + " does not exist on jQuery.spandex");
    }
  };

}).call(this);
