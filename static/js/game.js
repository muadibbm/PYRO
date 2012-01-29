(function() {
  var $, Game, getNeighbours, root;

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

  getNeighbours = function(x, y) {
    return [
      {
        x: x - 1,
        y: y
      }, {
        x: x + 1,
        y: y
      }, {
        x: x,
        y: y - 1
      }, {
        x: x,
        y: y + 1
      }
    ];
  };

  root.Game = Game = {};

  Game.fps = 15;

  Game.tileHeight = 25;

  Game.tileWidth = 25;

  Game.destructionConstant = 0.05;

  Game.propogationConstant = 0.12;

  Game.fireAnimationRate = 10;

  Game.MaxFireLevel = 10;

  Game.fireFadeRate = 0.683;

  Game.regenerationConstant = 0.1;

  Game.run = function() {
    Game.update();
    return Game.draw();
  };

  Game._lastFireSpriteUpdate = (new Date).getTime();

  Game.update = function() {
    var cell, i, map, n, nCell, needProgUpdate, neighbours, stoppedFireIndexes, _i, _j, _len, _len2, _ref, _ref2, _ref3, _results;
    map = Game.map;
    if (Game.cellsOnFire.length > 0) {
      stoppedFireIndexes = [];
      for (i = 0, _ref = Game.cellsOnFire.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        cell = Game.cellsOnFire[i];
        cell.hp -= Game.destructionConstant * cell.firelevel;
        if (cell.hp <= 0) {
          cell.hp = 0;
          cell.firelevel = 0;
          Game.treesBurnt++;
          Game.emit('progress', Game);
          if (Game.treesBurnt === Game.treeCount) Game.emit('victory', Game);
        } else {
          cell.firelevel -= Game.fireFadeRate;
          if (cell.firelevel < 0) cell.firelevel = 0;
        }
        neighbours = getNeighbours(cell.x, cell.y);
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
      for (i = _ref2 = Game.cellsOnFire.length - 1; _ref2 <= 0 ? i <= 0 : i >= 0; _ref2 <= 0 ? i++ : i--) {
        cell = Game.cellsOnFire[i];
        if (cell.firelevel <= 0) {
          cell.onFire = false;
          Game.cellsOnFire.splice(i, 1);
        }
      }
    }
    _ref3 = Game._waterCells;
    _results = [];
    for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
      cell = _ref3[_j];
      if (cell.hp < 0) {
        neighbours = getNeighbours(cell.x, cell.y);
        _results.push((function() {
          var _k, _len3, _results2;
          _results2 = [];
          for (_k = 0, _len3 = neighbours.length; _k < _len3; _k++) {
            n = neighbours[_k];
            if (map.cellExists(n.x, n.y)) {
              nCell = map.getCell(n.x, n.y);
              if (nCell.celltype === root.treeType && !nCell.onFire && nCell.hp < nCell.celltype.maxHp) {
                needProgUpdate = nCell.hp === 0 ? true : false;
                nCell.hp += Game.regenerationConstant;
                if (nCell.hp > nCell.celltype.maxHp) {
                  nCell.hp = nCell.celltype.maxHp;
                }
                cell.hp += Game.regenerationConstant;
                if (cell.hp > 0) cell.hp = 0;
                if (needProgUpdate && nCell.hp > 0) {
                  Game.treesBurnt--;
                  _results2.push(Game.emit('progress', Game));
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
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Game.cellsOnFire = [];

  Game.draw = function() {
    var cell, damageLevel, destX, destY, fireFrame, fireInterval, fireLevelSprite, spriteNum, srcX, srcY, x, y, _ref, _results;
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
          if (!cell.celltype.flammable) {
            if (cell.celltype.maxHp === 0) {
              srcX = 0;
              srcY = 0;
              _results2.push(Game.ctx.drawImage(cell.celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth, destX, destY, Game.tileHeight, Game.tileWidth));
            } else {
              spriteNum = Math.floor(3 - 3 * (cell.hp / cell.celltype.maxHp));
              srcX = spriteNum * Game.tileWidth;
              srcY = 0;
              _results2.push(Game.ctx.drawImage(cell.celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth, destX, destY, Game.tileHeight, Game.tileWidth));
            }
          } else {
            damageLevel = Math.floor(3 - 3 * (cell.hp / cell.celltype.maxHp));
            srcX = damageLevel * Game.tileWidth;
            srcY = 0;
            Game.ctx.drawImage(cell.celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth, destX, destY, Game.tileHeight, Game.tileWidth);
            if (cell.firelevel > 0.5) {
              fireLevelSprite = Math.floor((cell.firelevel / Game.MaxFireLevel) * 2.99);
              srcX = fireFrame * Game.tileWidth;
              srcY = fireLevelSprite * Game.tileHeight;
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

  Game._waterCells = [];

  Game.init = function(canvas, map, callback) {
    Game.canvas = canvas;
    Game.ctx = canvas.getContext('2d');
    Game.loadMap(map);
    Game.started = false;
    Game.initEvents();
    return root.loadImage('images/fire.png', function(err, image) {
      Game.fireSpriteSheet = image;
      return callback();
    });
  };

  Game.loadMap = function(map) {
    var cell, x, y, _i, _len, _ref, _ref2, _ref3;
    Game.map = map;
    Game._waterCells = [];
    Game.cellsOnFire = [];
    for (x = 0, _ref = map.width - 1; 0 <= _ref ? x <= _ref : x >= _ref; 0 <= _ref ? x++ : x--) {
      for (y = 0, _ref2 = map.height - 1; 0 <= _ref2 ? y <= _ref2 : y >= _ref2; 0 <= _ref2 ? y++ : y--) {
        cell = map.getCell(x, y);
        cell.x = x;
        cell.y = y;
        if (cell.celltype === root.waterType) Game._waterCells.push(cell);
      }
    }
    Game.treeCount = 0;
    _ref3 = map.map;
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      cell = _ref3[_i];
      if (cell.celltype === root.treeType) Game.treeCount++;
    }
    Game.treesBurnt = 0;
    return Game.emit('progress', Game);
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

}).call(this);
