tree = new CellType true, "images/tree.png", 10
empty = new CellType, false, "images/empty.png", -1
water = new CellType, false, "images/water.png", -1

map = []
width = 800
height = 600
cellWidth = 25
cellHeight = 25
numofCells = (width*height)/(cellWidth*cellHeight)
((map.push(new Cell(tree))) for num in [1..(numofCells/(2*cellwidth)-1)]
(map.push(new Cell(water))) for num in [(numofCells/(2*cellwidth))..(numofCells/cellwidth)]) for num in [1..(numofCells/(2*cellheight)-1)]
(map.push(new Cell(tree)) for num in [1..(numofCells/cellwidth)]) for num in [(numofCells/(2*cellheight))..(numofCells/cellHeight)]