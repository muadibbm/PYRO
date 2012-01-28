root = window
Game = root.Game

$ = jQuery


Game.initEvents()->
	$(Game.canvas).click (ev) ->
    	x = ev.clientX - Game.canvas.offsetLeft
    	y = ev.clientY - Game.canvas.offsetTop
    	