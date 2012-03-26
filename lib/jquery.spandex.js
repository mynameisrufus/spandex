(function() {
  var $;

  $ = jQuery;

  $.fn.spandex = function(method) {
    var methods;
    methods = {
      init: function(options) {
        this.each(function() {
          var $wrapper;
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
          delete options.wrapper;
          $wrapper.data('spandex', $.extend({
            speed: 0,
            centeredX: true,
            centeredY: true
          }, options));
          return $(this).prepend($wrapper).bind('change.spandex', options.change).bind('stretch.spandex', options.stretch);
        });
        if (options.use) {
          return methods.use.call(this, options.use);
        } else {
          return this;
        }
      },
      use: function(src, callback) {
        var stretch,
          _this = this;
        stretch = function($wrapper, $image, options) {};
        return this.each(function(index, el) {
          var $image, $wrapper, options;
          $wrapper = $(_this).find('.spandex');
          options = $wrapper.data('spandex');
          $image = $("<img />").css({
            position: "absolute",
            display: "none",
            margin: 0,
            padding: 0,
            border: "none",
            zIndex: -999999
          });
          $wrapper.find('img').fadeOut(options.speed, function() {
            return $(this).remove();
          });
          $wrapper.append($image);
          $image.fadeIn(options.speed);
          $image.on('load', function() {
            _this.trigger('change', $image);
            if (callback) return callback.call(_this, $image, values);
          });
          $image.on('load', function() {
            return stretch($wrapper, $image, options);
          });
          $(window).on('resize.spandex', function() {
            return stretch($wrapper, $image);
          });
          return $image.attr('src', src);
        });
      },
      destroy: function() {
        $(window).off('.spandex');
        return this.each(function() {
          return $(this).find('.spandex').remove();
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
