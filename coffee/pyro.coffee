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

    # bind move counter
    Game.on 'move', (moveCount) ->
      

    # bind about
    $('#about').click ->
      tb_show 'How to play', '#TB_inline?height=320&width=300&inlineId=hiddenModalContent'

    # bind victory
    victoryDiv = $("<div id='victoryMessage' class='TB_modal' style='display:none;'><div>Congratulations, you burnt down a forest.</div></div>")
    $('body').append victoryDiv
    Game.on 'victory', (game) ->
      #alert 'Good job, you burnt down the forest!'
      tb_show 'Victory', '#TB_inline?height=100&width=300&inlineId=victoryMessage'

    $('#burn').click ->
       Game.burnAll() 
    $('#randomize').click ->
      Game.loadMap root.randomMap 32, 16
      Game.start()
    $('#regrow').click ->
      #Game.loadMap root.randomMap 32, 16
      Game.regrow()
      Game.start()
    



    root.Game.start()
