$(function(){
  $(".controls button").on('click', function(event){
    event.preventDefault();
    target = $(this).data('target');
    $(target).spandex('use', $(this).data('image'));
  });
});
