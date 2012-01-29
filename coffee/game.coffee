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
Game.fps = 15
Game.tileHeight = 25
Game.tileWidth = 25
Game.destructionConstant = 0.05
Game.propogationConstant = 0.1
Game.fireAnimationRate = 3 # frames per second
Game.MaxFireLevel = 10
Game.fireFadeRate = 0.683
# --------------------------

Game.run = () ->
  Game.update()
  Game.draw()

Game.update = () ->
  if Game.cellsOnFire.length > 0
    map = Game.map
    stoppedFireIndexes = []
    for i in [0..Game.cellsOnFire.length-1]
      cell = Game.cellsOnFire[i]
      cell.hp -= Game.destructionConstant * cell.firelevel
      if cell.hp <= 0 
        cell.hp = 0
        cell.firelevel = 0
      else
        cell.firelevel -= Game.fireFadeRate
        cell.firelevel = 0 if cell.firelevel < 0

      #propogate
      neighbours = [
        {x: cell.x-1, y: cell.y},
        {x: cell.x+1, y: cell.y},
        {x: cell.x,   y: cell.y-1},
        {x: cell.x,   y: cell.y+1}
      ]
      
      if cell.firelevel > 0
        for n in neighbours
          if map.cellExists n.x, n.y
            nCell = map.getCell n.x, n.y
            if nCell.celltype.flammable and nCell.hp > 0
              if not nCell.onFire
                Game.cellsOnFire.push nCell
                nCell.onFire = true
              nCell.firelevel += Game.propogationConstant * cell.firelevel
              if nCell.firelevel > Game.MaxFireLevel
                nCell.firelevel = Game.MaxFireLevel
    

    tempArr = []
    for i in [0..Game.cellsOnFire.length-1]
      cell = Game.cellsOnFire[i]
      if cell.firelevel > 0
        tempArr.push cell
      else
        cell.onFire = false
    Game.cellsOnFire = tempArr

Game.cellsOnFire = []

Game.lastDraw = 0
Game.draw = () ->
  fireInterval = Math.floor(1000 / Game.fireAnimationRate)
  fireFrame = (Math.floor((new Date).getTime() / fireInterval)) % 3 # 3 total fire animation frames
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
        damageLevel = Math.floor(3 - 3* (cell.hp / cell.celltype.maxHp))
        srcX = damageLevel * Game.tileWidth
        srcY = 0
        Game.ctx.drawImage cell.celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth,
          destX, destY, Game.tileHeight, Game.tileWidth
        #check for fire, render fire
        if cell.firelevel > 0
          firesprite = Math.floor( (cell.firelevel/ Game.MaxFireLevel) * 2.99 )
          srcX = fireFrame * Game.tileWidth
          srcY = firesprite * Game.tileHeight
          Game.ctx.drawImage Game.fireSpriteSheet, srcX, srcY, Game.tileHeight, Game.tileWidth,
            destX, destY, Game.tileHeight, Game.tileWidth

          
  Game.lastDraw = (new Date).getTime()

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
  root.loadImage 'images/fire.png', (err, image) ->
    Game.fireSpriteSheet = image
    callback()

Game.loadMap = (map) ->
  # load images for cells
  Game.map = map
  

Game.start = () ->
  # Start the game loop
  Game._intervalId = setInterval Game.run, 1000 / Game.fps
