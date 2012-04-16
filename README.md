# Spandex

A jQuery and Zepto plugin for stretchy backgrounds.

__current status:__ in development

Tested:

* Chrome
* Firefox
* IE 7 and 8
* Safari
* iOS

## Basic usage
```javascript
$("body").spandex("/images/studio54.jpg");
```

See `tests` for other examples.

## IE

If you have problems in IE check for `img { maxWidth: 100%; }` or
similar as it creates problems some how, seems the only way to fix 
it is to remove it rather than redefine it.

### Credits

Thanks to [tequila](http://www.tequila.com.au/) for sponsoring the build
and [srobbin](https://github.com/srobbin/jquery-backstretch) for
backstretch.
