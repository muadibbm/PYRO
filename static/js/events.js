(function() {
  var $, Game, root;

  root = window;

  Game = root.Game;

  $ = jQuery;

  Game.MaxFireLevel = 10;

  Game.initEvents = function() {
    return $(Game.canvas).click(function(ev) {
      var cellx, celly, firedCell, x, y;
      x = ev.clientX - Game.canvas.offsetLeft;
      y = ev.clientY - Game.canvas.offsetTop;
      cellx = 0;
      celly = 0;
      cellx = Math.floor(x / Game.tileWidth);
      celly = Math.floor(y / Game.tileHeight);
      firedCell = Game.map.getCell(cellx, celly);
      if (firedCell.celltype.flammable) {
        firedCell.firelevel = Game.MaxFireLevel;
        if (Game.cellsOnFire.indexOf(firedCell) === -1) {
          return Game.cellsOnFire.push(firedCell);
        }
      }
    });
  };

}).call(this);
