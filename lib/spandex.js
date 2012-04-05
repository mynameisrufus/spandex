(function() {
  var $, root;

  root = this;

  $ = root.jQuery || root.Zepto || root.ender;

  $.fn.spandex = function(method) {
    var appendImage, appendWrapper, calculate, methods, safe, stretch, _method,
      _this = this;
    _method = function(method) {
      if (methods[method]) {
        return methods[method].apply(_this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'string') {
        methods.init.apply(_this);
        return methods.use.apply(_this, arguments);
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(_this, arguments);
      } else {
        return $.error("argument error for jQuery.spandex");
      }
    };
    safe = $.browser.msie && $.browser.version <= 7;
    calculate = {
      image: function(bw, bh, ow, oh, min) {
        var nh, nw, ol, ot, r, s;
        if (bw <= min.width) bw = min.width;
        if (bh <= min.height) bh = min.height;
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
          width: nw,
          height: nh,
          top: ot,
          left: ol,
          ratio: r,
          scale: s
        };
      },
      wrapper: function(bw, bh, clip, min) {
        var nh, nw;
        nw = bw - (clip.right + clip.left);
        if (nw <= min.width) nw = min.width;
        nh = bh - (clip.bottom + clip.top);
        if (nh <= min.height) nh = min.height;
        return {
          width: nw,
          height: nh,
          top: clip.top,
          left: clip.left
        };
      }
    };
    stretch = function($wrapper, $image, options) {
      var boundingHeight, boundingWidth, image, wrapper, _image;
      boundingWidth = options.wrapper.fullscreen ? $(window).width() : _this.width();
      boundingHeight = options.wrapper.fullscreen ? $(window).height() : _this.height();
      wrapper = calculate.wrapper(boundingWidth, boundingHeight, options.wrapper.clip, options.wrapper.min);
      $wrapper.css(wrapper);
      image = calculate.image(wrapper.width, wrapper.height, options.image.width, options.image.height, options.image.min);
      _image = {
        top: 0,
        left: 0,
        width: image.width,
        height: image.height
      };
      if (options.image.centered.y) _image.top = "-" + image.top + "px";
      if (options.image.centered.x) _image.left = "-" + image.left + "px";
      $image.css(_image);
      return _this.trigger('stretch', {
        wrapper: wrapper,
        image: image
      });
    };
    appendWrapper = function(index, el, options) {
      var $wrapper;
      $(el).find('div.spandex').remove();
      $wrapper = $(document.createElement('div')).addClass('spandex');
      $wrapper.css(options.wrapper.css);
      $wrapper.data('spandex', options);
      return $(el).append($wrapper);
    };
    appendImage = function(index, el, src, callback) {
      var $image, $wrapper, deferWrap, image, loadCallback, _options;
      $wrapper = $(el).find('div.spandex');
      _options = $wrapper.data('spandex');
      image = new Image();
      $image = $(image).css(_options.image.css);
      loadCallback = function() {
        var stretchCallback;
        $wrapper.find('img').fadeOut(_options.speed, function() {
          return $(this).remove();
        });
        $wrapper.append($image);
        window.img = $image;
        _options.image.width = image.width;
        _options.image.height = image.height;
        _options.image.src = src;
        $wrapper.data('spandex', _options);
        $image.fadeIn(_options.speed);
        stretchCallback = function() {
          var func;
          func = function() {
            return stretch($wrapper, $image, _options);
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
        if (callback) callback.apply(_this, $image);
        $(window).on("resize", stretchCallback);
        return _this.one('destroy', function() {
          _this.unbind('.spandex');
          $(window).off("resize", stretchCallback);
          clearTimeout($wrapper.data('spandex.timeout'));
          return $wrapper.remove();
        });
      };
      deferWrap = function() {
        var id;
        clearTimeout($wrapper.data('spandex.timeout'));
        if (_options.defer !== 0) {
          id = setTimeout(loadCallback, _options.defer);
          return $wrapper.data('spandex.timeout', id);
        } else {
          return loadCallback();
        }
      };
      return $image.one('load', deferWrap).attr('src', src).each(function() {
        if (this.complete) return $(this).trigger('load');
      });
    };
    methods = {
      init: function(options, src, callback) {
        var _options;
        if (options == null) options = {};
        _options = $.extend({
          speed: 0,
          defer: 0
        }, options);
        _options.wrapper = $.extend({
          fullscreen: true
        }, options.wrapper || (options.wrapper = {}));
        _options.wrapper.min = $.extend({
          width: 0,
          height: 0
        }, options.wrapper.min || {});
        _options.wrapper.clip = $.extend({
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }, options.wrapper.clip || {});
        _options.wrapper.css = $.extend({
          left: 0,
          top: 0,
          position: "fixed",
          overflow: "hidden",
          zIndex: -999999,
          margin: 0,
          padding: 0,
          height: "100%",
          width: "100%"
        }, options.wrapper.css || {});
        _options.image = $.extend({}, options.image || (options.image = {}));
        _options.image.centered = $.extend({
          x: true,
          y: true
        }, options.wrapper.centered || {});
        _options.image.min = $.extend({
          width: 0,
          height: 0
        }, options.wrapper.min || {});
        _options.image.css = $.extend({
          position: "absolute",
          display: "none",
          margin: 0,
          padding: 0,
          border: "none",
          zIndex: -999999,
          maxWidth: "none",
          maxHeight: "none",
          opacity: 100
        }, options.wrapper.css || {});
        this.each(function(index, el) {
          return appendWrapper(index, el, _options);
        });
        if (src) {
          return _method('use', src, callback);
        } else {
          return this;
        }
      },
      destroy: function() {
        return this.trigger('destroy');
      },
      stretch: function() {
        return this.trigger('resize');
      },
      use: function(src, callback) {
        var _this = this;
        return this.each(function(index, el) {
          return appendImage(index, el, src, callback);
        });
      }
    };
    return _method.apply(this, arguments);
  };

}).call(this);
