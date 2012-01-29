(function() {
  var CellType, root;

  root = window;

  CellType = root.CellType;

  root.treeType = new CellType(true, "images/tree.png", 10);

  root.grassType = new CellType(false, "images/grass.png", 0);

  root.waterType = new CellType(false, "images/waterfade.png", -10);

}).call(this);
