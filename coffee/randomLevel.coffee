root = window
{treeType, waterType, grassType, Map, Cell} = root

t = treeType
w = waterType
g = grassType

formations = 
    forest1 :
      [[0,0,t,t,t,0],
       [t,t,0,t,t,t],
       [0,t,t,0,t,0],
       [0,0,t,t,t,t]]
    puddle:
      [[0,0,w,w,0,0],
       [0,w,w,w,w,0],
       [w,w,w,w,w,w],
       [w,w,w,w,w,w],
       [0,w,w,w,w,0],
       [0,0,w,w,0,0]]
    thickForest:
      [[t,t,0,t,t,0,t],
       [t,t,t,t,0,t,t]
       [t,t,t,t,t,t,t],
       [t,t,t,t,t,0,t]]
    ring:
      [[0,0,t,t,t,0,0],
       [0,t,t,w,t,t,0],
       [t,t,w,w,w,t,t],
       [t,t,w,w,w,t,t],
       [0,t,t,w,t,t,0],
       [0,0,t,t,t,0,0]]
formationList = (f for n,f of formations)

solidMap = (width, height, cellType) ->
  cells = []
  for i in [0..height * width - 1]
    cells.push new Cell cellType
  new Map width, height, cells

addFormation = (map, formation, x, y) ->
  for i in [0..formation.length - 1]
    for j in [0..formation[0].length - 1 ]
      mapX = x + i
      mapY = y + j
      if formation[i][j] and  map.cellExists mapX, mapY
        map.setCell mapX, mapY, new Cell(formation[i][j])
 
randomInt = (min, max) -> Math.floor(Math.random()*(max-min+1)) + min 

root.randomMap = (width, height) ->
  map = solidMap width, height, g

  for i in [0..25]
    f = formationList[randomInt(0, formationList.length - 1)]
    x = randomInt(0, map.width - 1)
    y = randomInt(0, map.height - 1)
    addFormation map, f, x, y

  return map


 



