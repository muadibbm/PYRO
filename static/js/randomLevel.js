(function() {
  var Cell, Map, addFormation, f, formationList, formations, g, grassType, n, randomInt, root, solidMap, t, treeType, w, waterType;

  root = window;

  treeType = root.treeType, waterType = root.waterType, grassType = root.grassType, Map = root.Map, Cell = root.Cell;

  t = treeType;

  w = waterType;

  g = grassType;

  formations = {
    forest1: [[0, 0, t, t, t, 0], [t, t, 0, t, t, t], [0, t, t, 0, t, 0], [0, 0, t, t, t, t]],
    puddle: [[0, 0, w, w, 0, 0], [0, w, w, w, w, 0], [w, w, w, w, w, w], [w, w, w, w, w, w], [0, w, w, w, w, 0], [0, 0, w, w, 0, 0]],
    thickForest: [[t, t, 0, t, t, 0, t], [t, t, t, t, 0, t, t], [t, t, t, t, t, t, t], [t, t, t, t, t, 0, t]],
    ring: [[0, 0, t, t, t, 0, 0], [0, t, t, w, t, t, 0], [t, t, w, w, w, t, t], [t, t, w, w, w, t, t], [0, t, t, w, t, t, 0], [0, 0, t, t, t, 0, 0]]
  };

  formationList = (function() {
    var _results;
    _results = [];
    for (n in formations) {
      f = formations[n];
      _results.push(f);
    }
    return _results;
  })();

  solidMap = function(width, height, cellType) {
    var cells, i, _ref;
    cells = [];
    for (i = 0, _ref = height * width - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
      cells.push(new Cell(cellType));
    }
    return new Map(width, height, cells);
  };

  addFormation = function(map, formation, x, y) {
    var i, j, mapX, mapY, _ref, _results;
    _results = [];
    for (i = 0, _ref = formation.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
      _results.push((function() {
        var _ref2, _results2;
        _results2 = [];
        for (j = 0, _ref2 = formation[0].length - 1; 0 <= _ref2 ? j <= _ref2 : j >= _ref2; 0 <= _ref2 ? j++ : j--) {
          mapX = x + i;
          mapY = y + j;
          if (formation[i][j] && map.cellExists(mapX, mapY)) {
            _results2.push(map.setCell(mapX, mapY, new Cell(formation[i][j])));
          } else {
            _results2.push(void 0);
          }
        }
        return _results2;
      })());
    }
    return _results;
  };

  randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  root.randomMap = function(width, height) {
    var i, map, x, y;
    map = solidMap(width, height, g);
    for (i = 0; i <= 25; i++) {
      f = formationList[randomInt(0, formationList.length - 1)];
      x = randomInt(0, map.width - 1);
      y = randomInt(0, map.height - 1);
      addFormation(map, f, x, y);
    }
    return map;
  };

}).call(this);
