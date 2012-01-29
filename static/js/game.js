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

  Game.run = function() {
    Game.update();
    return Game.draw();
  };

  Game.update = function() {};

  Game.draw = function() {
    var destX, destY, srcX, srcY, x, y, _ref, _results;
    srcX = 0;
    srcY = 0;
    _results = [];
    for (x = 0, _ref = Game.map.width - 1; 0 <= _ref ? x <= _ref : x >= _ref; 0 <= _ref ? x++ : x--) {
      _results.push((function() {
        var _ref2, _results2;
        _results2 = [];
        for (y = 0, _ref2 = Game.map.height - 1; 0 <= _ref2 ? y <= _ref2 : y >= _ref2; 0 <= _ref2 ? y++ : y--) {
          destX = x * Game.tileWidth;
          destY = y * Game.tileHeight;
          _results2.push(Game.ctx.drawImage(Game.map.getCell(x, y).celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth, destX, destY, Game.tileHeight, Game.tileWidth));
        }
        return _results2;
      })());
    }
    return _results;
  };

  Game.init = function(canvas, map, callback) {
    Game.canvas = canvas;
    Game.map = map;
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
