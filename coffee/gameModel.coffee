root = window

root.Map = class Map
  #map should be a 1-dimensional array containing Cell objects
  constructor: (@width,@height,@map) ->  
  getCell: (x, y) ->
    @map[ y * @width + x % @width]
  cellExists: (x, y) ->
    x >=0 and x < @width and y >= 0 and y < @height

root.Cell = class Cell
    #hp is the hit point of the cell
    #fireLevel is the level of damge the fire is producing
    #celltype is and object of CellType
    constructor: (@celltype)->
      @hp = celltype.maxHp
      @firelevel = 0

root.CellType = class CellType
  #flammable specifies if the cell is affected by fire or not
  #tileName defines what type the cell is
  #maxHp specifies the starting hp of the cell
    constructor: (@flammable,@tileName,@maxHp)->
      root.loadImage @tileName, (err, image) =>
        @image = image
        @ready()
    
    ready: -> # can set this function to something else to execute when celltype is ready to use
   
