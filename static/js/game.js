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

  Game.destructionConstant = 0.08;

  Game.propogationConstant = 0.1;

  Game.fireAnimationRate = 10;

  Game.MaxFireLevel = 10;

  Game.fireFadeRate = 0.4;

  Game.regenerate = true;

  Game.regenerationConstant = 0.03;

  Game.makeSmoke = true;

  Game.smokeLikelihood = 0.2;

  Game.smokeSize = 7;

  Game.smokeLife = 2;

  Game.run = function() {
    Game.update();
    return Game.draw();
  };

  Game._lastUpdate = (new Date).getTime();

  Game.update = function() {
    var cell, delta, elapsed, i, map, n, nCell, needProgUpdate, neighbours, nn, nneighbours, noFire, smoke, stoppedFireIndexes, updateTime, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2, _ref3, _ref4;
    map = Game.map;
    updateTime = (new Date).getTime();
    elapsed = updateTime - Game._lastUpdate;
    if (Game.smoke.length > 0) {
      for (i = _ref = Game.smoke.length - 1; _ref <= 0 ? i <= 0 : i >= 0; _ref <= 0 ? i++ : i--) {
        smoke = Game.smoke[i];
        smoke.life -= elapsed / 1000;
        delta = 10 * (elapsed / 1000);
        smoke.x += delta;
        if (smoke.life <= 0) Game.smoke.splice(i, 1);
      }
    }
    if (Game.regenerate && !Game.burnMode && !Game.won) {
      _ref2 = Game._waterCells;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        cell = _ref2[_i];
        if (cell.hp < 0) {
          neighbours = getNeighbours(cell.x, cell.y);
          for (_j = 0, _len2 = neighbours.length; _j < _len2; _j++) {
            n = neighbours[_j];
            if (map.cellExists(n.x, n.y)) {
              nCell = map.getCell(n.x, n.y);
              if (!nCell.onFire) {
                nneighbours = getNeighbours(nCell.x, nCell.y);
                noFire = true;
                for (_k = 0, _len3 = nneighbours.length; _k < _len3; _k++) {
                  nn = nneighbours[_k];
                  if (map.cellExists(nn.x, nn.y)) {
                    if (map.getCell(nn.x, nn.y).firelevel > 0) noFire = false;
                  }
                }
                if (noFire) {
                  if (nCell.celltype === root.treeType && (!nCell.onFire) && nCell.hp < nCell.celltype.maxHp) {
                    needProgUpdate = nCell.hp === 0 ? true : false;
                    nCell.hp += Game.regenerationConstant;
                    if (nCell.hp < 0.1) nCell.hp = 0.1;
                    if (nCell.hp > nCell.celltype.maxHp) {
                      nCell.hp = nCell.celltype.maxHp;
                    }
                    cell.hp += Game.regenerationConstant;
                    if (cell.hp > 0) cell.hp = 0;
                    if (needProgUpdate && nCell.hp > 0) Game.treesBurnt--;
                  }
                }
              }
            }
          }
        }
      }
    }
    if (Game.cellsOnFire.length > 0) {
      stoppedFireIndexes = [];
      for (i = 0, _ref3 = Game.cellsOnFire.length - 1; 0 <= _ref3 ? i <= _ref3 : i >= _ref3; 0 <= _ref3 ? i++ : i--) {
        cell = Game.cellsOnFire[i];
        if (Game.makeSmoke && cell.firelevel === Game.MaxFireLevel) {
          if (Math.random() < Game.smokeLikelihood) {
            Game.smoke.push({
              x: cell.x * Game.tileWidth + Game.tileWidth / 2 + (Game.tileWidth * Math.random() - Game.tileWidth / 2),
              y: cell.y * Game.tileHeight + Game.tileHeight / 2 + (Game.tileHeight * Math.random() - Game.tileHeight / 2),
              life: Game.smokeLife
            });
          }
        }
        cell.hp -= Game.destructionConstant * cell.firelevel;
        if (cell.hp <= 0) {
          cell.hp = 0;
          cell.firelevel = 0;
          Game.treesBurnt++;
        } else {
          cell.firelevel -= Game.fireFadeRate;
          if (cell.firelevel < 0) cell.firelevel = 0;
        }
        neighbours = getNeighbours(cell.x, cell.y);
        if (cell.firelevel > 0) {
          for (_l = 0, _len4 = neighbours.length; _l < _len4; _l++) {
            n = neighbours[_l];
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
      for (i = _ref4 = Game.cellsOnFire.length - 1; _ref4 <= 0 ? i <= 0 : i >= 0; _ref4 <= 0 ? i++ : i--) {
        cell = Game.cellsOnFire[i];
        if (cell.firelevel <= 0) {
          cell.onFire = false;
          Game.cellsOnFire.splice(i, 1);
        }
      }
    }
    if (!Game.won) {
      Game.emit('progress', Game);
      if (Game.treesBurnt === Game.treeCount) {
        Game.won = true;
        Game.emit('victory', Game);
      }
    }
    return Game._lastUpdate = updateTime;
  };

  Game.cellsOnFire = [];

  Game.draw = function() {
    var cell, damageLevel, destX, destY, fireFrame, fireInterval, fireLevelSprite, smoke, spriteNum, srcX, srcY, x, y, yOffset, _i, _len, _ref, _ref2, _ref3;
    fireInterval = Math.floor(1000 / Game.fireAnimationRate);
    fireFrame = (Math.floor((new Date).getTime() / fireInterval)) % 3;
    Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    for (x = 0, _ref = Game.map.width - 1; 0 <= _ref ? x <= _ref : x >= _ref; 0 <= _ref ? x++ : x--) {
      for (y = 0, _ref2 = Game.map.height - 1; 0 <= _ref2 ? y <= _ref2 : y >= _ref2; 0 <= _ref2 ? y++ : y--) {
        destX = x * Game.tileWidth;
        destY = y * Game.tileHeight;
        cell = Game.map.getCell(x, y);
        if (!cell.celltype.flammable) {
          if (cell.celltype.maxHp === 0) {
            srcX = 0;
            srcY = 0;
            Game.ctx.drawImage(cell.celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth, destX, destY, Game.tileHeight, Game.tileWidth);
          } else {
            spriteNum = Math.floor(3 - 3 * (cell.hp / cell.celltype.maxHp));
            srcX = spriteNum * Game.tileWidth;
            srcY = 0;
            Game.ctx.drawImage(cell.celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth, destX, destY, Game.tileHeight, Game.tileWidth);
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
            Game.ctx.drawImage(Game.fireSpriteSheet, srcX, srcY, Game.tileHeight, Game.tileWidth, destX, destY, Game.tileHeight, Game.tileWidth);
          }
        }
      }
    }
    if (Game.makeSmoke) {
      _ref3 = Game.smoke;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        smoke = _ref3[_i];
        Game.ctx.globalAlpha = 0.2 * (smoke.life / Game.smokeLife);
        yOffset = (Game.smokeLife - (smoke.life / Game.smokeLife)) * 25;
        Game.ctx.beginPath();
        Game.ctx.arc(smoke.x, smoke.y - yOffset, Game.smokeSize, 0, 2 * Math.PI, true);
        Game.ctx.closePath();
        Game.ctx.fill();
        Game.ctx.beginPath();
        Game.ctx.arc(smoke.x - Game.smokeSize / 6, smoke.y - yOffset + Game.smokeSize / 6, Game.smokeSize / 3, 0, 2 * Math.PI, true);
        Game.ctx.closePath();
        Game.ctx.fill();
        Game.ctx.beginPath();
        Game.ctx.arc(smoke.x - Game.smokeSize / 4, smoke.y - yOffset + Game.smokeSize / 4, Game.smokeSize / 2, 0, 2 * Math.PI, true);
        Game.ctx.closePath();
        Game.ctx.fill();
      }
      return Game.ctx.globalAlpha = 1;
    }
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
    Game.moveCounter = 0;
    Game.emit('move', Game.moveCounter);
    Game.won = false;
    Game.burnMode = false;
    Game.map = map;
    Game._waterCells = [];
    Game.cellsOnFire = [];
    Game.smoke = [];
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

  Game.regrow = function() {
    var cell, _i, _len, _ref;
    Game.stop();
    Game.cellsOnFire = [];
    Game.moveCounter = 0;
    Game.emit('move', Game.moveCounter);
    _ref = Game.map.map;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cell = _ref[_i];
      cell.hp = cell.celltype.maxHp;
      cell.firelevel = 0;
      cell.onFire = false;
    }
    Game.treesBurnt = 0;
    Game.emit('progress', Game);
    Game.won = false;
    Game.burnMode = false;
    return Game.start();
  };

  Game.burnAll = function() {
    var cell, _i, _len, _ref, _results;
    Game.burnMode = true;
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
  };

}).call(this);
