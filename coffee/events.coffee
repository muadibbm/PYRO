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
    {x, y} = getPosition(ev)
    cellx = 0
    celly = 0
    cellx = Math.floor x/Game.tileWidth
    celly = Math.floor y/Game.tileHeight
    firedCell = Game.map.getCell(cellx,celly)
    if (firedCell.celltype.flammable)
      firedCell.firelevel = Game.MaxFireLevel
      if Game.cellsOnFire.indexOf(firedCell) == -1
        Game.cellsOnFire.push firedCell
        firedCell.onFire = true

