c = $('#myCanvas')[0]

ctx = c.getContext('2d')

Game = {}
Game.fps = 50

Game.run = () ->
  Game.update()
  Game.draw()

Game.update = () ->

Game.draw = () -> 

# Start the game loop
Game._intervalId = setInterval Game.run, 1000 / Game.fps




