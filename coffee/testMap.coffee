root = window
{Cell, CellType, Map} = root 

root.testMap = testMap = ->
  #tree = new CellType true, "images/tree.png", 10
  #grass = new CellType false, "images/grass.png", -1
  #water = new CellType false, "images/water.png", -1

  #map = []
  #numofCells = (width*height)/(cellWidth*cellHeight)
  #for i in [1..numofCells/2]
  # map.push new Cell(tree)
  # for i in [1+numofCells/2..numofCells]
  # map.push new Cell(water)
  # ((map.push(new Cell(tree))) for num in [1..(numofCells/(2*cellWidth)-1)]
  # (map.push(new Cell(water))) for num in [(numofCells/(2*cellWidth))..(numofCells/cellWidth)]) for num in [1..(numofCells/(2*cellHeight)-1)]
  # (map.push(new Cell(tree)) for num in [1..(numofCells/cellWidth)]) for num in [(numofCells/(2*cellHeight))..(numofCells/cellHeight)]

root.parseMap = (string) ->
  tree = new CellType true, "images/tree.png", 10
  grass = new CellType false, "images/grass.png", -1
  water = new CellType false, "images/water.png", -1
  width = 0
  firstRow = true
  height = 0
  map = []
  for s in [0..string.length - 1]
    char = string[s]
    if char == '0'
      map.push new Cell(grass)
    else if char == '1'
      map.push new Cell(tree)
    else if char == '2'
      map.push new Cell(water)
    else if char == '$'
      firstRow = false   
      height = height + 1
    else
      alert "Map had invalid format."
    if firstRow 
      width = width + 1
	  
  return new Map(width, height, map)
