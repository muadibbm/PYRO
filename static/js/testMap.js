(function() {
  var Cell, CellType, Map, root, testMap;

  root = window;

  Cell = root.Cell, CellType = root.CellType, Map = root.Map;

  root.testMap = testMap = function() {};

  root.parseMap = function(string) {
    var char, firstRow, grass, height, map, s, tree, water, width, _ref;
    tree = new CellType(true, "images/tree.png", 10);
    grass = new CellType(false, "images/grass.png", -1);
    water = new CellType(false, "images/water.png", -1);
    width = 0;
    firstRow = true;
    height = 0;
    map = [];
    for (s = 0, _ref = string.length - 1; 0 <= _ref ? s <= _ref : s >= _ref; 0 <= _ref ? s++ : s--) {
      char = string[s];
      if (char === '0') {
        map.push(new Cell(grass));
      } else if (char === '1') {
        map.push(new Cell(tree));
      } else if (char === '2') {
        map.push(new Cell(water));
      } else if (char === '$') {
        firstRow = false;
        height = height + 1;
      } else {
        alert("Map had invalid format.");
      }
      if (firstRow) width = width + 1;
    }
    return new Map(width, height, map);
  };

}).call(this);
