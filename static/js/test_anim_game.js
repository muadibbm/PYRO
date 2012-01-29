(function() {
  var $, Game, animHeight, animImage, animNumStates, animState, animWidth, loadImage, root;

  $ = jQuery;

  root = window;

  animWidth = 198;

  animHeight = 131;

  animState = 0;

  animNumStates = 5;

  animImage = null;

  loadImage = function(img_file, callback) {
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

  Game.run = function() {
    Game.update();
    return Game.draw();
  };

  Game.update = function() {
    animState++;
    if (animState >= animNumStates) return animState = 0;
  };

  Game.draw = function() {
    var srcHeight, srcWidth, srcX, srcY;
    srcX = animState * animWidth;
    srcY = 0;
    srcWidth = animWidth;
    srcHeight = animHeight;
    return Game.ctx.drawImage(animImage, srcX, srcY, srcHeight, srcWidth, 0, 0, srcHeight, srcWidth);
  };

  Game.init = function(canvas, callback) {
    Game.ctx = canvas.getContext('2d');
    return loadImage('images/treeCollection.png', function(err, image) {
      animImage = image;
      return callback();
    });
  };

  Game.start = function() {
    return Game._intervalId = setInterval(Game.run, 1000 / Game.fps);
  };

}).call(this);
