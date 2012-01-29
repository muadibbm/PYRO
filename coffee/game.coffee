$ = jQuery
root = window

root.loadImage = (img_file, callback) ->
  image = new Image()
  image.onload = ->
    err = null
    callback(err, image)
  image.src = img_file

root.Game = Game = {}
Game.fps = 5

Game.tileHeight = 25
Game.tileWidth = 25

Game.run = () ->
  Game.update()
  Game.draw()

Game.update = () ->
  #animState++
  #if animState >= animNumStates then animState = 0


Game.draw = () ->
  srcX = 0
  srcY = 0
  for x in [0..Game.map.width]
    for y in [0..Game.map.height]
      destX = x * Game.tileWidth
      destY = y * Game.tileHeight
      Game.ctx.drawImage Game.map.getCell(x, y).image, srcX, srcY, Game.tileHeight, Game.tileWidth,
        destX, destY, Game.tileHeight, Game.tileWidth

  #srcX = animState * animWidth
  #srcY = 0
  #srcWidth = animWidth
  #srcHeight = animHeight
  #Game.ctx.drawImage animImage, srcX, srcY, srcHeight, srcWidth,
  #  0, 0, srcHeight, srcWidth

Game.init = (canvas, map, callback) ->
  Game.canvas = canvas 
  Game.map = map
  Game.ctx = canvas.getContext '2d'
  Game.initEvents()
  callback()

Game.loadMap = (map) ->
  # load images for cells
  Game.map = map
  

Game.start = () ->
  # Start the game loop
  Game._intervalId = setInterval Game.run, 1000 / Game.fps




