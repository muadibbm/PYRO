$ = jQuery
root = window

# test animation
animWidth = 198
animHeight = 131
animState = 0
animNumStates = 5
animImage = null

loadImage = (img_file, callback) ->
  image = new Image()
  image.onload = ->
    err = null
    callback(err, image)
  image.src = img_file


root.Game = Game = {}
Game.fps = 5

Game.run = () ->
  Game.update()
  Game.draw()

Game.update = () ->
  animState++
  if animState >= animNumStates then animState = 0


Game.draw = () -> 
  srcX = animState * animWidth
  srcY = 0
  srcWidth = animWidth
  srcHeight = animHeight
  Game.ctx.drawImage animImage, srcX, srcY, srcHeight, srcWidth,
    0, 0, srcHeight, srcWidth

Game.init = (canvas, callback) ->
  Game.ctx = canvas.getContext '2d'
  loadImage 'images/treeCollection.png', (err, image) ->
    animImage = image
    callback()
  

Game.start = () ->
  # Start the game loop
  Game._intervalId = setInterval Game.run, 1000 / Game.fps




