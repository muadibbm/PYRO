(function() {
  var $, root;

  $ = jQuery;

  root = window;

  $(window).ready(function() {
    var c, map;
    c = $('#myCanvas')[0];
    map = root.testMap();
    return root.Game.init(c, map, function() {
      return root.Game.start();
    });
  });

}).call(this);
