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
      var progBar;
      progBar = $('.progressBar')[0];
      Game.on('progress', function(game) {
        var progWidth, treeCount, treesBurnt;
        treeCount = game.treeCount, treesBurnt = game.treesBurnt;
        progWidth = (treesBurnt / treeCount) * $(progBar).width();
        return $($(progBar).children()[0]).width(progWidth);
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
            if (!cell.onFire) Game.cellsOnFire.push(cell);
            _results.push(cell.onFire = true);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
      $('#randomize').click(function() {
        return Game.loadMap(root.randomMap(32, 16));
      });
      $('#regrow').click(function() {
        return Game.loadMap(root.randomMap(32, 16));
      });
      return root.Game.start();
    });
  });

}).call(this);
