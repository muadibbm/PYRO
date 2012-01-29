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
      cellx = Math.floor((x/Game.canvas.width) * Game.map.width)
      celly = Math.floor((y/Game.canvas.height) * Game.map.height)
      firedCell = Game.map.getCell(cellx,celly)
      if (firedCell.celltype.flammable)
        firedCell.firelevel = Game.MaxFireLevel
        if Game.cellsOnFire.indexOf(firedCell) == -1
          Game.cellsOnFire.push firedCell

