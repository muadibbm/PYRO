$ = jQuery
root = window

root.loadImage = (img_file, callback) ->
  image = new Image()
  image.onload = ->
    err = null
    callback(err, image)
  image.src = img_file

getNeighbours = (x, y) -> 
  [
    {x: x-1, y: y},
    {x: x+1, y: y},
    {x: x,   y: y-1},
    {x: x,   y: y+1}
  ]


root.Game = Game = {}

# ------ GAME PARAMS -------
Game.fps = 15
Game.tileHeight = 25
Game.tileWidth = 25
Game.destructionConstant = 0.05
Game.propogationConstant = 0.12
Game.fireAnimationRate = 10 # frames per second
Game.MaxFireLevel = 10
Game.fireFadeRate = 0.683
Game.regenerationConstant = 0.1
# --------------------------

Game.run = () ->
  Game.update()
  Game.draw()

Game._lastFireSpriteUpdate = (new Date).getTime()
Game.update = () ->
  map = Game.map
  if Game.cellsOnFire.length > 0
    stoppedFireIndexes = []
    for i in [0..Game.cellsOnFire.length-1]
      cell = Game.cellsOnFire[i]
      cell.hp -= Game.destructionConstant * cell.firelevel
      if cell.hp <= 0 
        cell.hp = 0
        cell.firelevel = 0
        Game.treesBurnt++
        Game.emit 'progress', Game
        if Game.treesBurnt == Game.treeCount
          Game.emit 'victory', Game
      else
        cell.firelevel -= Game.fireFadeRate
        cell.firelevel = 0 if cell.firelevel < 0

      #propogate
      neighbours = getNeighbours cell.x, cell.y
      
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

    for i in [Game.cellsOnFire.length-1..0]
      cell = Game.cellsOnFire[i]
      if cell.firelevel <= 0
        cell.onFire = false 
        Game.cellsOnFire.splice i,1

  # regeneration
  for cell in Game._waterCells
    if cell.hp < 0 #negative hp means regneration points
      neighbours = getNeighbours cell.x, cell.y
      for n in neighbours
        if map.cellExists n.x, n.y
          nCell = map.getCell n.x, n.y
          if nCell.celltype == root.treeType and not nCell.onFire and nCell.hp < nCell.celltype.maxHp
            needProgUpdate = if nCell.hp == 0 then true else false
            nCell.hp += Game.regenerationConstant
            if nCell.hp > nCell.celltype.maxHp then nCell.hp = nCell.celltype.maxHp
            cell.hp += Game.regenerationConstant
            if cell.hp > 0 then cell.hp = 0
            if needProgUpdate and nCell.hp > 0
              Game.treesBurnt--
              Game.emit 'progress', Game

Game.cellsOnFire = []

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
      if not cell.celltype.flammable
        if cell.celltype.maxHp == 0
          srcX = 0
          srcY = 0
          Game.ctx.drawImage cell.celltype.image, srcX, srcY, Game.tileHeight, Game.tileWidth,
            destX, destY, Game.tileHeight, Game.tileWidth
        else # cell can regenerate
          spriteNum = Math.floor(3 - 3 * (cell.hp / cell.celltype.maxHp))
          srcX = spriteNum * Game.tileWidth
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
        if cell.firelevel > 0.5
          fireLevelSprite = Math.floor( (cell.firelevel/ Game.MaxFireLevel) * 2.99 )
          srcX = fireFrame * Game.tileWidth
          srcY = fireLevelSprite * Game.tileHeight
          Game.ctx.drawImage Game.fireSpriteSheet, srcX, srcY, Game.tileHeight, Game.tileWidth,
            destX, destY, Game.tileHeight, Game.tileWidth

Game._waterCells = []

Game.init = (canvas, map, callback) ->
  Game.canvas = canvas 
  Game.ctx = canvas.getContext '2d'
  Game.loadMap map
  Game.started = false
  
  Game.initEvents()
  root.loadImage 'images/fire.png', (err, image) ->
    Game.fireSpriteSheet = image
    callback()

Game.loadMap = (map) ->
  Game.map = map
  Game._waterCells = []
  Game.cellsOnFire = []
  for x in [0..map.width - 1]
    for y in [0..map.height - 1]
      cell = map.getCell(x,y)
      cell.x = x
      cell.y = y 
      if cell.celltype == root.waterType
        Game._waterCells.push cell
  
  # prepare progress
  Game.treeCount = 0
  for cell in map.map
    Game.treeCount++ if cell.celltype == root.treeType
  Game.treesBurnt = 0
  Game.emit 'progress', Game

Game.start = () ->
  if not Game.started
    # Start the game loop
    Game._intervalId = setInterval Game.run, 1000 / Game.fps
    Game.started = true

Game.stop = () ->
  if Game.started
    clearTimeout Game._intervalId
    Game.started = false

#Game.clear = () ->
#  if Game.started
#    Game.stop()
#  Game.map = []




