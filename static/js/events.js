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
      if (Game.started) {
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
      }
    });
  };

  Game._listeners = {};

  Game.emit = function(eventName, arg) {
    var l, _i, _len, _ref, _results;
    if (Game._listeners[eventName] != null) {
      _ref = Game._listeners[eventName];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        l = _ref[_i];
        _results.push(l(arg));
      }
      return _results;
    }
  };

  Game.on = function(eventName, listener) {
    if (!(Game._listeners[eventName] != null)) Game._listeners[eventName] = [];
    return Game._listeners[eventName].push(listener);
  };

}).call(this);
