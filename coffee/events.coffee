root = window
Game = root.Game

$ = jQuery

Game.MaxFireLevel = 10

Game.initEvents = () ->
	$(Game.canvas).click (ev) ->
    	   x = ev.clientX - Game.canvas.offsetLeft
    	   y = ev.clientY - Game.canvas.offsetTop
    	cellx = 0
    	celly = 0
    	cellx = Math.floor(cellx = (x/Game.canvas.width))
    	celly = Math.floor(celly = (y/Game.canvas.height))
    	Firedcell = Game.map.getCell(cellx,celly)
    	Firedcell.fireLevel = Game.MaxFireLevel