$ = jQuery
root = window

root.loadImage = (img_file, callback) ->
  image = new Image()
  image.onload = ->
    err = null
    callback(err, image)
  image.src = img_file

root.Game = Game = {}

# ------ GAME PARAMS -------
Game.fps = 5
Game.tileHeight = 25
Game.tileWidth = 25
Game.destructionConstant = 0.1
Game.propogationConstant = 0.5
# --------------------------

Game.run = () ->
  Game.update()
  Game.draw()

Game.update = () ->
  if Game.cellsOnFire.length > 0
    map = Game.map
    for i in [0..Game.cellsOnFire.length-1]
      cell = Game.cellsOnFire[i]
      cell.hp -= Game.destructionConstant * cell.firelevel
      if cell.hp < 0 
        cell.hp = 0
      cell.firelevel -= 1

      #propogate
      neighbours = [
        {x: cell.x-1, y: cell.y},
        {x: cell.x+1, y: cell.y},
        {x: cell.x,   y: cell.y-1},
        {x: cell.x,   y: cell.y+1}
      ]
      
      for n in neighbours
        if map.cellExists n.x, n.y
          nCell = map.getCell n.x, n.y
          if nCell.celltype.flammable and nCell.hp > 0
            if nCell.firelevel == 0
              Game.cellsOnFire.push nCell
            nCell.firelevel += Game.propogationConstant * cell.firelevel
            if nCell.firelevel > Game.MaxFireLevel
              nCell.firelevel = Game.MaxFireLevel

Game.cellsOnFire = []

Game.draw = () ->
  # clear background
  Game.ctx.clearRect 0, 0, Game.canvas.width, Game.canvas.height
  for x in [0..Game.map.width-1]
    for y in [0..Game.map.height-1]
      destX = x * Game.tileWidth
      destY = y * Game.tileHeight
      cell = Game.map.getCell x, y
      if cell.hp == -1
        srcX = 0
        srcY = 0
        Game.ctx.drawImage cell.celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth,
          destX, destY, Game.tileHeight, Game.tileWidth
      else
        # 4 levels of tree damage
        damageLevel = Math.floor(4 - 4* (cell.hp / cell.celltype.maxHp))
        srcX = damageLevel * Game.tileWidth
        srcY = 0
        Game.ctx.drawImage cell.celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth,
          destX, destY, Game.tileHeight, Game.tileWidth
        #TODO check for fire, render fire

Game.init = (canvas, map, callback) ->
  Game.canvas = canvas 
  Game.map = map
  for x in [0..map.width - 1]
    for y in [0..map.height - 1]
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
