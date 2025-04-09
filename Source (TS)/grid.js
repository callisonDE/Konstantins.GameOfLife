var GameOfLife;
(function (GameOfLife) {
    var Grid = /** @class */ (function () {
        function Grid(canvasHost) {
            if (canvasHost === void 0) { canvasHost = null; }
            canvasHost !== null && canvasHost !== void 0 ? canvasHost : (canvasHost = document.getElementById("canvas"));
            this._cellSize = 8;
            this._hostElement = canvasHost;
            this._context = canvasHost.getContext("2d");
        }
        Object.defineProperty(Grid.prototype, "cellSize", {
            get: function () {
                return this._cellSize;
            },
            enumerable: false,
            configurable: true
        });
        Grid.prototype.clear = function () {
            this._context.clearRect(0, 0, this._hostElement.width, this._hostElement.height);
        };
        Grid.prototype.set = function (x, y, color) {
            this._context.fillStyle = color;
            this._context.fillRect(x * this._cellSize, y * this._cellSize, this._cellSize, this._cellSize);
        };
        return Grid;
    }());
    GameOfLife.Grid = Grid;
})(GameOfLife || (GameOfLife = {}));
//# sourceMappingURL=grid.js.map