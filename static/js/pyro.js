(function() {
  var $, root;

  $ = jQuery;

  root = window;

  $(window).ready(function() {
    var c, map;
    c = $('#myCanvas')[0];
    map = root.parseMap(root.levelTwo);
    map = root.randomMap(30, 16);
    return root.Game.init(c, map, function() {
      var progBar;
      progBar = $('.progressBar')[0];
      Game.on('progress', function(game) {
        var progWidth, treeCount, treesBurnt;
        treeCount = game.treeCount, treesBurnt = game.treesBurnt;
        progWidth = (treesBurnt / treeCount) * $(progBar).width();
        return $($(progBar).children()[0]).width(progWidth);
      });
      Game.on('victory', function(game) {
        Game.stop();
        return alert('Good job, you burnt down the forest!');
      });
      return root.Game.start();
    });
  });

}).call(this);
