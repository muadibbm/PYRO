(function() {
  var $, Game, root;

  root = window;

  Game = root.Game;

  $ = jQuery;

  Game.MaxFireLevel = 10;

  Game.initEvents = function() {
    return $(Game.canvas).click(function(ev) {
      var Firedcell, cellx, celly, x, y;
      x = ev.clientX - Game.canvas.offsetLeft;
      y = ev.clientY - Game.canvas.offsetTop;
      cellx = 0;
      celly = 0;
      cellx = Math.floor(cellx = x / Game.canvas.width);
      celly = Math.floor(celly = y / Game.canvas.height);
      Firedcell = Game.map.getCell(cellx, celly);
      if (Firedcell.flammable) return Firedcell.fireLevel = Game.MaxFireLevel;
    });
  };

}).call(this);
