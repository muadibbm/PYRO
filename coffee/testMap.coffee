root = window
{Cell, CellType, Map} = root 

root.testMap = testMap = ->
  tree = new CellType true, "images/tree.png", 10
  grass = new CellType false, "images/grass.png", -1
  water = new CellType false, "images/water.png", -1

  map = []
  width = 800
  height = 600
  cellWidth = 25
  cellHeight = 25
  numofCells = (width*height)/(cellWidth*cellHeight)
  for i in [1..numofCells]
    map.push new Cell(tree)
  # ((map.push(new Cell(tree))) for num in [1..(numofCells/(2*cellWidth)-1)]
  # (map.push(new Cell(water))) for num in [(numofCells/(2*cellWidth))..(numofCells/cellWidth)]) for num in [1..(numofCells/(2*cellHeight)-1)]
  # (map.push(new Cell(tree)) for num in [1..(numofCells/cellWidth)]) for num in [(numofCells/(2*cellHeight))..(numofCells/cellHeight)]

  mapWidth = width/cellWidth
  mapHeight = height/cellHeight
  return new Map(mapWidth, mapHeight, map)
