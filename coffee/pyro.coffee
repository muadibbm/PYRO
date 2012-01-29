$ = jQuery
root = window

$(window).ready ->

  c = $('#myCanvas')[0]
  map = root.testMap()
  root.Game.init c, map, ->
    root.Game.start()
