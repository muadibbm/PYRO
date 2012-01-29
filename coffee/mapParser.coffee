root = window
{Cell, CellType, Map} = root 

root.parseMap = (string) ->
  width = 0
  firstRow = true
  height = 0
  map = []
  for s in [0..string.length - 1]
    char = string[s]
    if char == '0'
      map.push new Cell(root.grassType)
    else if char == '1'
      map.push new Cell(root.treeType)
    else if char == '2'
      map.push new Cell(root.waterType)
    else if char == '$'
      firstRow = false   
      height = height + 1
    else
      alert "Map had invalid format."
    if firstRow 
      width = width + 1
    
  return new Map(width, height, map)
