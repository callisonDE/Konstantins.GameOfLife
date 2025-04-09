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
            return neighbors;
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
            this._coords = [];
            this.gridSize = gridSize;
        }
        SetOfCoords.prototype.hasCoords = function (x, y) {
            var index = this.getIndex(x, y);
            return this._coords[index] != null;
        };
        SetOfCoords.prototype.insert = function (coords) {
            var index = this.getIndex(coords.x, coords.y);
            this._coords[index] = coords;
        };
        SetOfCoords.prototype.getCoords = function () {
            var coords = [];
            for (var _i = 0, _a = this._coords; _i < _a.length; _i++) {
                var coord = _a[_i];
                if (!coord) {
                    continue;
                }
                coords.push(coord);
            }
            return coords;
        };
        SetOfCoords.prototype.getIndex = function (x, y) {
            return x + this.gridSize * y;
        };
        return SetOfCoords;
    }());
    var Builder = /** @class */ (function () {
        function Builder(gridSize) {
            this._setOfAliveCoords = new SetOfCoords(gridSize);
        }
        Builder.prototype.build = function () {
            return new Generation(0, this._setOfAliveCoords.getCoords());
        };
        Builder.prototype.makeAlive = function (x, y) {
            this._setOfAliveCoords.insert(new Coords(x, y));
            return this;
        };
        Builder.prototype.isAlive = function (x, y) {
            return this._setOfAliveCoords.hasCoords(x, y);
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
            var AliveCoordsInNextGeneration = new SetOfCoords(gridSize);
            // apply rules to alive coords
            for (var _i = 0, _a = this.aliveCoords; _i < _a.length; _i++) {
                var aliveCoord = _a[_i];
                var numberOfAliveNeighbors = this.calculateNumberOfNeighborsAlive(aliveCoord);
                if (Rules.doesAliveCoordRemainAlive(numberOfAliveNeighbors)) {
                    AliveCoordsInNextGeneration.insert(aliveCoord);
                }
            }
            // apply rules to dead neighbor coords
            var deadNeighborCoords = this.getDeadNeighborCoordsOfAliveCoords();
            for (var _b = 0, deadNeighborCoords_1 = deadNeighborCoords; _b < deadNeighborCoords_1.length; _b++) {
                var deadNeighborCoord = deadNeighborCoords_1[_b];
                var AliveNeighbors = this.calculateNumberOfNeighborsAlive(deadNeighborCoord);
                if (Rules.doesDeadCoordTurnAlive(AliveNeighbors)) {
                    AliveCoordsInNextGeneration.insert(deadNeighborCoord);
                }
            }
            return new Generation(this.nr + 1, AliveCoordsInNextGeneration.getCoords());
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
        Generation.prototype.calculateNumberOfNeighborsAlive = function (coords) {
            var neighbors = coords.getNeighbors();
            return this.countNumberOfCoordsAlive(neighbors);
        };
        Generation.prototype.countNumberOfCoordsAlive = function (coords) {
            var coordsAlive = 0;
            for (var _i = 0, coords_1 = coords; _i < coords_1.length; _i++) {
                var coord = coords_1[_i];
                if (this.hasAliveCoords(coord.x, coord.y)) {
                    coordsAlive++;
                }
            }
            return coordsAlive;
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
    var StartGenerationImporter = /** @class */ (function () {
        function StartGenerationImporter() {
        }
        StartGenerationImporter.prototype.import = function (text, startPointX, startPointY) {
            var coordsForStartGeneration = [];
            var singleRows = text.split('\n');
            for (var y = 0; y < singleRows.length; y++) {
                var row = singleRows[y];
                console.log(row.length);
                for (var x = 0; x < row.length; x++) {
                    if (row[x] == 'O') {
                        coordsForStartGeneration.push(new Coords(x + startPointX, y + startPointY));
                        console.log(x + startPointX, y + startPointY);
                    }
                }
            }
            /*
            for (let coords of importedStartGeneration)
            {
                new GenerationBuilder(1000)
                for (let coord of importedStartGeneration)
                {
    
                }
            }
            */
            return new Generation(0, coordsForStartGeneration);
        };
        return StartGenerationImporter;
    }());
    GameOfLife.StartGenerationImporter = StartGenerationImporter;
})(GameOfLife || (GameOfLife = {}));
function drawGenerationOnGrid(grid, generation) {
    grid.clear();
    for (var _i = 0, _a = generation.aliveCoords; _i < _a.length; _i++) {
        var aliveCoords = _a[_i];
        grid.set(aliveCoords.x, aliveCoords.y, "black");
    }
}
function createStartGeneration(gridSize) {
    return new GameOfLife.Builder(gridSize)
        .makeAlive(0, 2)
        .makeAlive(1, 0)
        .makeAlive(1, 2)
        .makeAlive(2, 1)
        .makeAlive(2, 2)
        .build();
}
function next() {
    currentGeneration = currentGeneration.calculateNextGeneration(gridSize);
    console.log(currentGeneration);
    drawGenerationOnGrid(grid, currentGeneration);
}
function play() {
    setInterval(next, 50);
}
function importFromTextArea() {
    var importer = new GameOfLife.StartGenerationImporter();
    var importTextArea = document.getElementById('areaOfOwnStartGeneration');
    var startPointX = 0;
    var startPointY = 0;
    currentGeneration = importer.import(importTextArea.value, startPointX, startPointY);
    drawGenerationOnGrid(grid, currentGeneration);
}
var gridSize = 1000;
var grid = new GameOfLife.Grid();
var currentGeneration = createStartGeneration(gridSize);
drawGenerationOnGrid(grid, currentGeneration);
//# sourceMappingURL=life.js.map