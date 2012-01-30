root = window
Game = root.Game

$ = jQuery

getPosition = (e) ->
  e = window.event if not e?
  targ = if e.target? then e.target else e.srcElement
  targ = targ.parentNode if targ.nodeType == 3 # safari bugfix

  $targ = $(targ)
  x = e.pageX - $targ.offset().left
  y = e.pageY - $targ.offset().top

  {x: x, y: y}

Game.initEvents = () ->
  $(Game.canvas).click (ev) ->
    if Game.started
      {x, y} = getPosition(ev)
      cellx = 0
      celly = 0
      cellx = Math.floor x/Game.tileWidth
      celly = Math.floor y/Game.tileHeight
      firedCell = Game.map.getCell(cellx,celly)
      if firedCell.celltype.flammable and firedCell.hp > 0
        firedCell.firelevel = Game.MaxFireLevel
        #if Game.cellsOnFire.indexOf(firedCell) == -1
        if not firedCell.onFire
          Game.cellsOnFire.push firedCell
          firedCell.onFire = true


# Event Emitter
Game._listeners = {}
Game.emit = (eventName, arg) ->
  if Game._listeners[eventName]?
    for l in Game._listeners[eventName]
      l arg
Game.on = (eventName, listener) ->
  if not Game._listeners[eventName]?
    Game._listeners[eventName] = []
  Game._listeners[eventName].push listener
