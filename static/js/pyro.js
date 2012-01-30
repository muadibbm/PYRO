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
      victoryDiv = $("<div id='victoryMessage' class='TB_modal' style='display:none;'><div>Congratulations, you burnt down a forest.</div></div>");
      $('body').append(victoryDiv);
      Game.on('victory', function(game) {
        Game.stop();
        return tb_show('Victory', '#TB_inline?height=100&width=300&inlineId=victoryMessage');
      });
      $('#burn').click(function() {
        var cell, _i, _len, _ref, _results;
        Game.cellsOnFire = [];
        _ref = root.Game.map.map;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cell = _ref[_i];
          if (cell.celltype === root.treeType && cell.hp > 0) {
            cell.firelevel = Game.MaxFireLevel;
            Game.cellsOnFire.push(cell);
            _results.push(cell.onFire = true);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
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
