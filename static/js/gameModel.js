(function() {
  var Cell, CellType, Map, root;

  root = window;

  root.Map = Map = (function() {

    function Map(width, height, map) {
      this.width = width;
      this.height = height;
      this.map = map;
    }

    Map.prototype.getCell = function(x, y) {
      return this.map[y * this.width + x % this.width];
    };

    Map.prototype.cellExists = function(x, y) {
      return x >= 0 && x < this.width && y >= 0 && y < this.height;
    };

    return Map;

  })();

  root.Cell = Cell = (function() {

    function Cell(celltype) {
      this.celltype = celltype;
      this.hp = celltype.maxHp;
      this.firelevel = 0;
    }

    return Cell;

  })();

  root.CellType = CellType = (function() {

    function CellType(flammable, tileName, maxHp) {
      var _this = this;
      this.flammable = flammable;
      this.tileName = tileName;
      this.maxHp = maxHp;
      root.loadImage(this.tileName, function(err, image) {
        _this.image = image;
        return _this.ready();
      });
    }

    CellType.prototype.ready = function() {};

    return CellType;

  })();

}).call(this);
