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

# ------ GAME PARAMS -------
Game.tileHeight = 25
Game.tileWidth = 25
Game.destructionConstant = 0.1
Game.propogationConstant = 0.5
# --------------------------

Game.run = () ->
  Game.update()
  Game.draw()

Game.update = () ->
  for i=[0..Game.cellsOnFire.length-1]
    cell = Game.cellsOnFire[i]
    cell.hp -= Game.destructionConstant * cell.firelevel
    cell.firelevel -= 1
    
  

Game.cellsOnFire = []

Game.draw = () ->
  srcX = 0
  srcY = 0
  for x in [0..Game.map.width-1]
    for y in [0..Game.map.height-1]
      destX = x * Game.tileWidth
      destY = y * Game.tileHeight
      Game.ctx.drawImage Game.map.getCell(x, y).celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth,
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
  for x in [0..map.width - 1]
    for y in [0..map.height -1]
      cell = map.getCell(x,y)
      cell.x = x
      cell.y = y 
  Game.ctx = canvas.getContext '2d'
  Game.initEvents()
  callback()

Game.loadMap = (map) ->
  # load images for cells
  Game.map = map
  

Game.start = () ->
  # Start the game loop
  Game._intervalId = setInterval Game.run, 1000 / Game.fps




