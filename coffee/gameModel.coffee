class Map
	#map should be a 1-dimensional array containing Cell objects
    constructor: (@width,@height,@map) ->

class Cell
    #hp is the hit point of the cell
    #fireLevel is the level of damge the fire is producing
    #celltype is and object of CellType
    constructor: (@celltype)->
    	@hp = celltype.maxHp
    	@firelevel = 0

class CellType
	#flammable specifies if the cell is affected by fire or not
	#tileName defines what type the cell is
	#maxHp specifies the starting hp of the cell
    constructor: (@flammable,@tileName,@maxHp)->
    
