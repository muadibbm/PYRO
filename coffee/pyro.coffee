$ = jQuery
root = window

$(window).ready ->

  c = $('#myCanvas')[0]
  # map = root.testMap()
  map = root.parseMap root.levelTwo
  map = root.randomMap 32, 16
  root.Game.init c, map, ->

    # bind progress bar
    progBar = $('.progressBar')[0]
    Game.on 'progress', (game) ->
      {treeCount, treesBurnt} = game
      progWidth = (treesBurnt/treeCount) * $(progBar).width()
      $($(progBar).children()[0]).width progWidth

    # bind victory
    #Game.on 'victory', (game) ->
    #  Game.stop()
    #  alert 'Good job, you burnt down the forest!'

    $('#burn').click ->
      Game.cellsOnFire = []
      for cell in root.Game.map.map
        if cell.celltype == root.treeType and cell.hp > 0
          cell.firelevel = Game.MaxFireLevel  
          if not cell.onFire then Game.cellsOnFire.push cell
          cell.onFire = true
        
    $('#randomize').click ->
      Game.loadMap root.randomMap 32, 16
    $('#regrow').click ->
      Game.loadMap root.randomMap 32, 16

    root.Game.start()
