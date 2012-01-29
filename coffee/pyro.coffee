$ = jQuery
root = window

$(window).ready ->

  c = $('#myCanvas')[0]
  # map = root.testMap()
  map = root.parseMap root.levelFour
  root.Game.init c, map, ->
    root.Game.start()
