root = window
Game = root.Game

$ = jQuery

Game.initEvents = () ->
  $(Game.canvas).click (ev) ->
      x = ev.clientX - Game.canvas.offsetLeft
      y = ev.clientY - Game.canvas.offsetTop
      cellx = 0
      celly = 0
      cellx = Math.floor x/Game.tileWidth
      celly = Math.floor y/Game.tileHeight
      firedCell = Game.map.getCell(cellx,celly)
      if (firedCell.celltype.flammable)
        firedCell.firelevel = Game.MaxFireLevel
        if Game.cellsOnFire.indexOf(firedCell) == -1
          Game.cellsOnFire.push firedCell

