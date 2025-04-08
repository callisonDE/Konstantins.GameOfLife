var GameOfLife;
(function (GameOfLife) {
    var Coords = /** @class */ (function () {
        function Coords(x, y) {
            this.x = x;
            this.y = y;
        }
        Coords.prototype.getNeighbors = function () {
            var neighbors = [];
            for (var x = this.x - 1; x <= this.x + 1; x++)
                for (var y = this.y - 1; y <= this.y + 1; y++) {
                    if (x == this.x &&
                        y == this.y) {
                        continue;
                    }
                    neighbors.push(new Coords(x, y));
                }
        };
        return Coords;
    }());
    GameOfLife.Coords = Coords;
    var Rules = /** @class */ (function () {
        function Rules() {
        }
        Rules.doesAliveCoordRemainAlive = function (NeighborsAlive) {
            // rule #1: Any live cell with two or three live neighbours lives on to the next generation.
            if (NeighborsAlive == 2 || NeighborsAlive == 3) {
                return true;
            }
            // rule #0: Any live cell with fewer than two live neighbours dies, as if by underpopulation.
            // rule #2: Any live cell with more than three live neighbours dies, as if by overpopulation.
            return false;
        };
        Rules.doesDeadCoordTurnAlive = function (NeighborsAlive) {
            // rule #3: Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
            return NeighborsAlive == 3;
        };
        return Rules;
    }());
    GameOfLife.Rules = Rules;
    var SetOfCoords = /** @class */ (function () {
        function SetOfCoords(gridSize) {
            this.gridSize = gridSize;
            this.coords = [];
        }
        SetOfCoords.prototype.hasCoords = function (x, y) {
            var index = this.getIndex(x, y);
            return this.coords[index];
        };
        SetOfCoords.prototype.insert = function (coords) {
            var index = this.getIndex(coords.x, coords.y);
            this.coords[index] = coords;
        };
        SetOfCoords.prototype.getIndex = function (x, y) {
            return x + this.gridSize * y;
        };
        SetOfCoords.prototype.getCoords = function () {
            var coords = [];
            for (var _i = 0, _a = this.coords; _i < _a.length; _i++) {
                var coord = _a[_i];
                if (!coord) {
                    continue;
                }
                coords.push(coord);
            }
            return coords;
        };
        return SetOfCoords;
    }());
    GameOfLife.SetOfCoords = SetOfCoords;
    var Builder = /** @class */ (function () {
        function Builder(gridSize) {
            this.setOfAliveCoords = new SetOfCoords(gridSize);
        }
        Builder.prototype.build = function () {
            return new Generation(0, this.setOfAliveCoords.getCoords());
        };
        Builder.prototype.makeAlive = function (x, y) {
            this.setOfAliveCoords.insert(new Coords(x, y));
            return this;
        };
        Builder.prototype.isAlive = function (x, y) {
            return this.setOfAliveCoords.hasCoords(x, y);
        };
        return Builder;
    }());
    GameOfLife.Builder = Builder;
    var Generation = /** @class */ (function () {
        function Generation(nr, aliveCoords) {
            this.nr = nr;
            this.aliveCoords = aliveCoords;
        }
        Generation.prototype.calculateNextGeneration = function (gridSize) {
            var setOfAliveCoordsInNextGeneration = new SetOfCoords(gridSize);
            // apply rules to alive coords
            for (var _i = 0, _a = this.aliveCoords; _i < _a.length; _i++) {
                var aliveCoord = _a[_i];
                var AliveNeighbors = this.calculateNumberOfNeighborsAlive(aliveCoord);
                if (Rules.doesAliveCoordRemainAlive(AliveNeighbors)) {
                    setOfAliveCoordsInNextGeneration.insert(aliveCoord);
                }
            }
            // apply rules to dead neighbor coords
            var deadNeighborCoords = this.getDeadNeighborCoordsOfAliveCoords();
            for (var _b = 0, deadNeighborCoords_1 = deadNeighborCoords; _b < deadNeighborCoords_1.length; _b++) {
                var deadNeighborCoord = deadNeighborCoords_1[_b];
                var AliveNeighbors = this.calculateNumberOfNeighborsAlive(deadNeighborCoord);
                if (Rules.doesDeadCoordTurnAlive(AliveNeighbors)) {
                    setOfAliveCoordsInNextGeneration.insert(deadNeighborCoord);
                }
            }
            return new Generation(this.nr + 1, setOfAliveCoordsInNextGeneration.getCoords());
        };
        Generation.prototype.getDeadNeighborCoordsOfAliveCoords = function () {
            var deadNeighborCoords = [];
            for (var _i = 0, _a = this.aliveCoords; _i < _a.length; _i++) {
                var aliveCoord = _a[_i];
                for (var _b = 0, _c = aliveCoord.getNeighbors(); _b < _c.length; _b++) {
                    var neighborCoord = _c[_b];
                    if (neighborCoord.x < 0 ||
                        neighborCoord.y < 0) {
                        continue;
                    }
                    else if (!this.hasAliveCoords(neighborCoord.x, neighborCoord.y)) {
                        deadNeighborCoords.push(neighborCoord);
                    }
                }
            }
            return deadNeighborCoords;
        };
        Generation.prototype.calculateNumberOfNeighborsAlive = function (aliveCoord) {
            var neighbors = aliveCoord.getNeighbors();
            var numberOfNeighborsAlive = this.countNumberOfCoordsAlive(neighbors);
            return numberOfNeighborsAlive;
        };
        Generation.prototype.countNumberOfCoordsAlive = function (coords) {
            var CoordsAlive = 0;
            for (var _i = 0, coords_1 = coords; _i < coords_1.length; _i++) {
                var coord = coords_1[_i];
                if (this.hasAliveCoords(coord.x, coord.y)) {
                    CoordsAlive++;
                }
            }
            return CoordsAlive;
        };
        Generation.prototype.hasAliveCoords = function (x, y) {
            for (var _i = 0, _a = this.aliveCoords; _i < _a.length; _i++) {
                var aliveCoord = _a[_i];
                if (aliveCoord.x == x &&
                    aliveCoord.y == y) {
                    return true;
                }
            }
            return false;
        };
        return Generation;
    }());
    GameOfLife.Generation = Generation;
})(GameOfLife || (GameOfLife = {}));
var canvas = document.getElementById("canvas");
var grid = new GameOfLife.Grid(canvas);
canvas.getContext("2d");
console.log(canvas);
console.log(grid);
function add(x, y) {
    var sum = x + y;
    console.log('result', sum);
}
function concat(x, y) {
    var concatenatedValue = x + y;
    console.log('result', concatenatedValue);
}
add(3, 4);
concat("hello", "world");
console.log("cellsize", grid.cellSize);
//# sourceMappingURL=life.js.map