# Spandex

A jQuery plugin for stretchy backgrounds.

__current status:__ in development

## Basic usage
```html
<body>
  <div id="dancefloor"></div>
</body>
```
```javascript
$("#dancefloor").spandex({use: "/images/studio54.jpg"});
```

## Advanced usage
```javascript
$("#dancefloor").spandex({
  use: "/images/studio54.jpg",
  minWidth: 960,
  speed: 1000,
  change: function() {
    // after image load and change callback
  },
  stretch: function () {
    // images size change callback
  }
});
```

## Changing images
```javascript
$dFloor = $("#dancefloor").spandex({speed: 'slow'});
$dFloor.spandex("use", "/images/studio54.jpg"});

setTimeout(function() {
 $dFloor.spandex("use", "/images/john_travolta.jpg");
}, 5000);
```

## Dynamic position of overlayed elements

```javascript
$dFloor = $("#dancefloor");

$elem = $("#myElem");
$elem.css({position: "absolute"});
$dFloor.bind("stretch", function(event, values) {
  $elem.css("top", (values.height * 0.3 * values.ratio) - values.offsetTop);
  $elem.css("left", (values.width * 0.1) - values.offsetLeft);
});
$dFloor.spandex("use", "/images/studio54.jpg"});
```

### Credits

Thanks to [tequila](http://www.tequila.com.au/) for sponsoring the build
and [srobbin](https://github.com/srobbin/jquery-backstretch) for
backstretch.
