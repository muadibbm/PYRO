(function() {
  var Cell, CellType, Map, root;

  root = window;

  Cell = root.Cell, CellType = root.CellType, Map = root.Map;

  root.parseMap = function(string) {
    var char, firstRow, height, map, s, width, _ref;
    width = 0;
    firstRow = true;
    height = 0;
    map = [];
    for (s = 0, _ref = string.length - 1; 0 <= _ref ? s <= _ref : s >= _ref; 0 <= _ref ? s++ : s--) {
      char = string[s];
      if (char === '0') {
        map.push(new Cell(root.grassType));
      } else if (char === '1') {
        map.push(new Cell(root.treeType));
      } else if (char === '2') {
        map.push(new Cell(root.waterType));
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
