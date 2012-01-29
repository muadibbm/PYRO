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

  Game.fps = 15;

  Game.tileHeight = 25;

  Game.tileWidth = 25;

  Game.destructionConstant = 0.05;

  Game.propogationConstant = 0.1;

  Game.fireAnimationRate = 3;

  Game.MaxFireLevel = 10;

  Game.fireFadeRate = 0.683;

  Game.run = function() {
    Game.update();
    return Game.draw();
  };

  Game.update = function() {
    var cell, i, map, n, nCell, neighbours, stoppedFireIndexes, _i, _len, _ref, _ref2, _results;
    if (Game.cellsOnFire.length > 0) {
      map = Game.map;
      stoppedFireIndexes = [];
      for (i = 0, _ref = Game.cellsOnFire.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        cell = Game.cellsOnFire[i];
        cell.hp -= Game.destructionConstant * cell.firelevel;
        if (cell.hp <= 0) {
          cell.hp = 0;
          cell.firelevel = 0;
        } else {
          cell.firelevel -= Game.fireFadeRate;
          if (cell.firelevel < 0) cell.firelevel = 0;
        }
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
        if (cell.firelevel > 0) {
          for (_i = 0, _len = neighbours.length; _i < _len; _i++) {
            n = neighbours[_i];
            if (map.cellExists(n.x, n.y)) {
              nCell = map.getCell(n.x, n.y);
              if (nCell.celltype.flammable && nCell.hp > 0) {
                if (!nCell.onFire) {
                  Game.cellsOnFire.push(nCell);
                  nCell.onFire = true;
                }
                nCell.firelevel += Game.propogationConstant * cell.firelevel;
                if (nCell.firelevel > Game.MaxFireLevel) {
                  nCell.firelevel = Game.MaxFireLevel;
                }
              }
            }
          }
        }
      }
      _results = [];
      for (i = _ref2 = Game.cellsOnFire.length - 1; _ref2 <= 0 ? i <= 0 : i >= 0; _ref2 <= 0 ? i++ : i--) {
        cell = Game.cellsOnFire[i];
        if (cell.firelevel <= 0) {
          cell.onFire = false;
          _results.push(Game.cellsOnFire.splice(i, 1));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };

  Game.cellsOnFire = [];

  Game.draw = function() {
    var cell, damageLevel, destX, destY, fireFrame, fireInterval, firesprite, srcX, srcY, x, y, _ref, _results;
    fireInterval = Math.floor(1000 / Game.fireAnimationRate);
    fireFrame = (Math.floor((new Date).getTime() / fireInterval)) % 3;
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
            damageLevel = Math.floor(3 - 3 * (cell.hp / cell.celltype.maxHp));
            srcX = damageLevel * Game.tileWidth;
            srcY = 0;
            Game.ctx.drawImage(cell.celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth, destX, destY, Game.tileHeight, Game.tileWidth);
            if (cell.firelevel > 0) {
              firesprite = Math.floor((cell.firelevel / Game.MaxFireLevel) * 2.99);
              srcX = fireFrame * Game.tileWidth;
              srcY = firesprite * Game.tileHeight;
              _results2.push(Game.ctx.drawImage(Game.fireSpriteSheet, srcX, srcY, Game.tileHeight, Game.tileWidth, destX, destY, Game.tileHeight, Game.tileWidth));
            } else {
              _results2.push(void 0);
            }
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
    Game.started = false;
    for (x = 0, _ref = map.width - 1; 0 <= _ref ? x <= _ref : x >= _ref; 0 <= _ref ? x++ : x--) {
      for (y = 0, _ref2 = map.height - 1; 0 <= _ref2 ? y <= _ref2 : y >= _ref2; 0 <= _ref2 ? y++ : y--) {
        cell = map.getCell(x, y);
        cell.x = x;
        cell.y = y;
      }
    }
    Game.ctx = canvas.getContext('2d');
    Game.initEvents();
    return root.loadImage('images/fire.png', function(err, image) {
      Game.fireSpriteSheet = image;
      return callback();
    });
  };

  Game.loadMap = function(map) {
    return Game.map = map;
  };

  Game.start = function() {
    if (!Game.started) {
      Game._intervalId = setInterval(Game.run, 1000 / Game.fps);
      return Game.started = true;
    }
  };

  Game.stop = function() {
    if (Game.started) {
      clearTimeout(Game._intervalId);
      return Game.started = false;
    }
  };

  Game.clear = function() {
    if (Game.started) Game.stop();
    return Game.map = [];
  };

}).call(this);
