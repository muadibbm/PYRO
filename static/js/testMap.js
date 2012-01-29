(function() {
  var Cell, CellType, Map, root, testMap;

  root = window;

  Cell = root.Cell, CellType = root.CellType, Map = root.Map;

  root.testMap = testMap = function() {
    var cellHeight, cellWidth, grass, height, i, map, mapHeight, mapWidth, numofCells, tree, water, width;
    tree = new CellType(true, "images/tree.png", 10);
    grass = new CellType(false, "images/grass.png", -1);
    water = new CellType(false, "images/water.png", -1);
    map = [];
    width = 800;
    height = 600;
    cellWidth = 25;
    cellHeight = 25;
    numofCells = (width * height) / (cellWidth * cellHeight);
    for (i = 1; 1 <= numofCells ? i <= numofCells : i >= numofCells; 1 <= numofCells ? i++ : i--) {
      map.push(new Cell(tree));
    }
    mapWidth = width / cellWidth;
    mapHeight = height / cellHeight;
    return new Map(mapWidth, mapHeight, map);
  };

}).call(this);
