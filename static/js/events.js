(function() {
  var $, Game, getPosition, root;

  root = window;

  Game = root.Game;

  $ = jQuery;

  getPosition = function(e) {
    var $targ, targ, x, y;
    if (!(e != null)) e = window.event;
    targ = e.target != null ? e.target : e.srcElement;
    if (targ.nodeType === 3) targ = targ.parentNode;
    $targ = $(targ);
    x = e.pageX - $targ.offset().left;
    y = e.pageY - $targ.offset().top;
    return {
      x: x,
      y: y
    };
  };

  Game.initEvents = function() {
    return $(Game.canvas).click(function(ev) {
      var cellx, celly, firedCell, x, y, _ref;
      _ref = getPosition(ev), x = _ref.x, y = _ref.y;
      cellx = 0;
      celly = 0;
      cellx = Math.floor(x / Game.tileWidth);
      celly = Math.floor(y / Game.tileHeight);
      firedCell = Game.map.getCell(cellx, celly);
      if (firedCell.celltype.flammable) {
        firedCell.firelevel = Game.MaxFireLevel;
        if (Game.cellsOnFire.indexOf(firedCell) === -1) {
          Game.cellsOnFire.push(firedCell);
          return firedCell.onFire = true;
        }
      }
    });
  };

}).call(this);
