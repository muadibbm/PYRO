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

  Game.fireAnimationRate = 5;

  Game.run = function() {
    Game.update();
    return Game.draw();
  };

  Game.update = function() {
    var cell, i, map, n, nCell, neighbours, stoppedFireIndexes, _i, _j, _len, _len2, _ref, _ref2, _results;
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
          cell.firelevel -= 1;
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
        for (_i = 0, _len = neighbours.length; _i < _len; _i++) {
          n = neighbours[_i];
          if (map.cellExists(n.x, n.y)) {
            nCell = map.getCell(n.x, n.y);
            if (nCell.celltype.flammable && nCell.hp > 0) {
              if (nCell.firelevel === 0) Game.cellsOnFire.push(nCell);
              nCell.firelevel += Game.propogationConstant * cell.firelevel;
              if (nCell.firelevel > Game.MaxFireLevel) {
                nCell.firelevel = Game.MaxFireLevel;
              }
            }
          }
        }
      }
      for (i = 0, _ref2 = Game.cellsOnFire.length - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
        if (Game.cellsOnFire[i].firelevel <= 0) stoppedFireIndexes.push(i);
      }
      _results = [];
      for (_j = 0, _len2 = stoppedFireIndexes.length; _j < _len2; _j++) {
        i = stoppedFireIndexes[_j];
        _results.push(Game.cellsOnFire.splice(i, 1));
      }
      return _results;
    }
  };

  Game.cellsOnFire = [];

  Game.lastDraw = 0;

  Game.draw = function() {
    var cell, damageLevel, destX, destY, fireFrame, fireInterval, firesprite, srcX, srcY, x, y, _ref, _ref2;
    fireInterval = Math.floor(1000 / Game.fireAnimationRate);
    fireFrame = ((new Date).getTime() % fireInterval) % 3;
    Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    for (x = 0, _ref = Game.map.width - 1; 0 <= _ref ? x <= _ref : x >= _ref; 0 <= _ref ? x++ : x--) {
      for (y = 0, _ref2 = Game.map.height - 1; 0 <= _ref2 ? y <= _ref2 : y >= _ref2; 0 <= _ref2 ? y++ : y--) {
        destX = x * Game.tileWidth;
        destY = y * Game.tileHeight;
        cell = Game.map.getCell(x, y);
        if (cell.hp === -1) {
          srcX = 0;
          srcY = 0;
          Game.ctx.drawImage(cell.celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth, destX, destY, Game.tileHeight, Game.tileWidth);
        } else {
          damageLevel = Math.floor(3 - 3 * (cell.hp / cell.celltype.maxHp));
          srcX = damageLevel * Game.tileWidth;
          srcY = 0;
          Game.ctx.drawImage(cell.celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth, destX, destY, Game.tileHeight, Game.tileWidth);
          if (cell.firelevel > 0) {
            firesprite = Math.floor((cell.firelevel / Game.MaxFireLevel) * 2.99);
            srcX = fireFrame * Game.tileWidth;
            srcY = firesprite * Game.tileHeight;
            Game.ctx.drawImage(Game.fireSpriteSheet, srcX, srcY, Game.tileHeight, Game.tileWidth, destX, destY, Game.tileHeight, Game.tileWidth);
          }
        }
      }
    }
    return Game.lastDraw = (new Date).getTime();
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
    return root.loadImage('images/fire.png', function(err, image) {
      Game.fireSpriteSheet = image;
      return callback();
    });
  };

  Game.loadMap = function(map) {
    return Game.map = map;
  };

  Game.start = function() {
    return Game._intervalId = setInterval(Game.run, 1000 / Game.fps);
  };

}).call(this);
