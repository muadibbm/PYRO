(function() {
  var $, root;

  $ = jQuery;

  root = window;

  $(window).ready(function() {
    var c, map;
    c = $('#myCanvas')[0];
    map = root.parseMap(root.levelTwo);
    map = root.randomMap(32, 16);
    return root.Game.init(c, map, function() {
      var progBar, victoryDiv;
      progBar = $('.progressBar')[0];
      Game.on('progress', function(game) {
        var progWidth, treeCount, treesBurnt;
        treeCount = game.treeCount, treesBurnt = game.treesBurnt;
        progWidth = (treesBurnt / treeCount) * $(progBar).width();
        return $($(progBar).children()[0]).width(progWidth);
      });
      Game.on('move', function(moveCount) {});
      $('#about').click(function() {
        return tb_show('How to play', '#TB_inline?height=320&width=300&inlineId=hiddenModalContent');
      });
      victoryDiv = $("<div id='victoryMessage' class='TB_modal' style='display:none;'><div>Congratulations, you burnt down a forest.</div></div>");
      $('body').append(victoryDiv);
      Game.on('victory', function(game) {
        return tb_show('Victory', '#TB_inline?height=100&width=300&inlineId=victoryMessage');
      });
      $('#burn').click(function() {
        return Game.burnAll();
      });
      $('#randomize').click(function() {
        Game.loadMap(root.randomMap(32, 16));
        return Game.start();
      });
      $('#regrow').click(function() {
        Game.regrow();
        return Game.start();
      });
      return root.Game.start();
    });
  });

}).call(this);
