(function() {
  var $, Game, root;

  $ = jQuery;

  root = window;

  root.loadImage = function(img_file, callback) {
    var image;
    image = new Image();
    image.onload = function() {
      var err;
      err = null;
      return callback(err, image);
    };
    return image.src = img_file;
  };

  root.Game = Game = {};

  Game.fps = 5;

  Game.tileHeight = 25;

  Game.tileWidth = 25;

  Game.destructionConstant = 0.1;

  Game.propogationConstant = 0.5;

  Game.run = function() {
    Game.update();
    return Game.draw();
  };

  Game.update = function() {
    var cell, i, n, nCell, neighbours, _ref, _results;
    if (Game.cellsOnFire.length > 0) {
      _results = [];
      for (i = 0, _ref = Game.cellsOnFire.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        cell = Game.cellsOnFire[i];
        cell.hp -= Game.destructionConstant * cell.firelevel;
        cell.firelevel -= 1;
        neighbours = [
          {
            x: cell.x - 1,
            y: cell.y
          }, {
            x: cell.x + 1,
            y: cell.y
          }, {
            x: cell.x,
            y: cell.y - 1
          }, {
            x: cell.x,
            y: cell.y + 1
          }
        ];
        _results.push((function() {
          var _i, _len, _results2;
          _results2 = [];
          for (_i = 0, _len = neighbours.length; _i < _len; _i++) {
            n = neighbours[_i];
            if (map.cellExists(n.x, n.y)) {
              nCell = map.getCell(n.x, n.y);
              if (n.flammable) {
                n.firelevel += Game.propogationConstant * c.firelevel;
                if (n.firelevel > Game.MaxFireLevel) {
                  _results2.push(n.firelevel = Game.MaxFireLevel);
                } else {
                  _results2.push(void 0);
                }
              } else {
                _results2.push(void 0);
              }
            } else {
              _results2.push(void 0);
            }
          }
          return _results2;
        })());
      }
      return _results;
    }
  };

  Game.cellsOnFire = [];

  Game.draw = function() {
    var cell, damageLevel, destX, destY, srcX, srcY, x, y, _ref, _results;
    Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    _results = [];
    for (x = 0, _ref = Game.map.width - 1; 0 <= _ref ? x <= _ref : x >= _ref; 0 <= _ref ? x++ : x--) {
      _results.push((function() {
        var _ref2, _results2;
        _results2 = [];
        for (y = 0, _ref2 = Game.map.height - 1; 0 <= _ref2 ? y <= _ref2 : y >= _ref2; 0 <= _ref2 ? y++ : y--) {
          destX = x * Game.tileWidth;
          destY = y * Game.tileHeight;
          cell = Game.map.getCell(x, y);
          if (cell.hp === -1) {
            srcX = 0;
            srcY = 0;
            _results2.push(Game.ctx.drawImage(cell.celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth, destX, destY, Game.tileHeight, Game.tileWidth));
          } else {
            damageLevel = Math.floor(4 - 4 * (cell.hp / cell.celltype.maxHp));
            srcX = damageLevel * Game.tileWidth;
            srcY = 0;
            _results2.push(Game.ctx.drawImage(cell.celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth, destX, destY, Game.tileHeight, Game.tileWidth));
          }
        }
        return _results2;
      })());
    }
    return _results;
  };

  Game.init = function(canvas, map, callback) {
    var cell, x, y, _ref, _ref2;
    Game.canvas = canvas;
    Game.map = map;
    for (x = 0, _ref = map.width - 1; 0 <= _ref ? x <= _ref : x >= _ref; 0 <= _ref ? x++ : x--) {
      for (y = 0, _ref2 = map.height - 1; 0 <= _ref2 ? y <= _ref2 : y >= _ref2; 0 <= _ref2 ? y++ : y--) {
        cell = map.getCell(x, y);
        cell.x = x;
        cell.y = y;
      }
    }
    Game.ctx = canvas.getContext('2d');
    Game.initEvents();
    return callback();
  };

  Game.loadMap = function(map) {
    return Game.map = map;
  };

  Game.start = function() {
    return Game._intervalId = setInterval(Game.run, 1000 / Game.fps);
  };

}).call(this);
