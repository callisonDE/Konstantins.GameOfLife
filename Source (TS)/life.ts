namespace GameOfLife {
    export class Coords {
        public readonly x: number;
        public readonly y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        getNeighbors() {
            let neighbors:Coords[] = [];
            for (let x: number = this.x - 1; x <= this.x + 1; x++)
                for (let y = this.y - 1; y <= this.y + 1; y++) {

                    if (x == this.x &&
                        y == this.y) {
                        continue;
                    }

                    neighbors.push(new Coords(x, y));
                }
        }
    }

    export class Rules {
        static doesAliveCoordRemainAlive(NeighborsAlive: number) {
            // rule #1: Any live cell with two or three live neighbours lives on to the next generation.
            if (NeighborsAlive == 2 || NeighborsAlive == 3) {
                return true;
            }

            // rule #0: Any live cell with fewer than two live neighbours dies, as if by underpopulation.
            // rule #2: Any live cell with more than three live neighbours dies, as if by overpopulation.
            return false;
        }

        static doesDeadCoordTurnAlive(NeighborsAlive: number) {
            // rule #3: Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
            return NeighborsAlive == 3;
        }
    }

    export class SetOfCoords {
        public readonly gridSize: number;
        public coords: number[];
        constructor(gridSize: number) {
            this.gridSize = gridSize;
            this.coords = [];
        }

        hasCoords(x: number, y: number) {
            let index: number = this.getIndex(x, y);
            return this.coords[index];
        }
        insert(coords) {
            let index: number = this.getIndex(coords.x, coords.y);
            this.coords[index] = coords;
        }
        getIndex(x: number, y: number) {
            return x + this.gridSize * y;
        }
        getCoords() {
            let coords: Coords[] = [];
            for (let coord of this.coords) {
                if (!coord) {
                    continue;
                }

                coords.push(coord);
            }

            return coords;
        }
    }

    export class Builder {
        public readonly setOfAliveCoords: SetOfCoords;
        constructor(gridSize: number) {
            this.setOfAliveCoords = new SetOfCoords(gridSize);
        }
        build() {
            return new Generation(0, this.setOfAliveCoords.getCoords());
        }
        makeAlive(x: number, y: number) {
            this.setOfAliveCoords.insert(new Coords(x, y));
            return this;
        }
        isAlive(x: number, y: number) {
            return this.setOfAliveCoords.hasCoords(x, y);
        }
    }

    export class Generation {
        public readonly nr: number;
        public aliveCoords: Coords[];
        constructor(nr: number, aliveCoords: []) {
            this.nr = nr;
            this.aliveCoords = aliveCoords;
        }
    
        calculateNextGeneration(gridSize: number) {
            let AliveCoordsInNextGeneration = new SetOfCoords(gridSize);
    
            // apply rules to alive coords
            for (let aliveCoord of this.aliveCoords) {
                let AliveNeighbors = this.calculateNumberOfNeighborsAlive(aliveCoord);
    
                if (Rules.doesAliveCoordRemainAlive(AliveNeighbors)) {
                    AliveCoordsInNextGeneration.insert(aliveCoord);
                }
            }
    
            // apply rules to dead neighbor coords
            let deadNeighborCoords: Coords[] = this.getDeadNeighborCoordsOfAliveCoords();
            for (let deadNeighborCoord of deadNeighborCoords) {
                let AliveNeighbors = this.calculateNumberOfNeighborsAlive(deadNeighborCoord);
    
                if (Rules.doesDeadCoordTurnAlive(AliveNeighbors)) {
                    AliveCoordsInNextGeneration.insert(deadNeighborCoord)
                }
            }
    
            return new Generation(this.nr + 1, AliveCoordsInNextGeneration.getCoords());
        }
    
        getDeadNeighborCoordsOfAliveCoords() {
            let deadNeighborCoords: Coords[] = [];
    
            for (let aliveCoord of this.aliveCoords) {
                for (let neighborCoord of aliveCoord.getNeighbors()) {
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
        }
        calculateNumberOfNeighborsAlive(aliveCoord: Coords) {
            let neighbors:Coords[] = aliveCoord.getNeighbors();
            let numberOfNeighborsAlive = this.countNumberOfCoordsAlive(neighbors);
    
            return numberOfNeighborsAlive;
        }
        countNumberOfCoordsAlive(coords: Coords[]) {
            let CoordsAlive = 0;
    
            for (let coord of coords) {
                if (this.hasAliveCoords(coord.x, coord.y)) {
                    CoordsAlive++;
                }
            }
    
            return CoordsAlive;
        }
        hasAliveCoords(x: number, y: number) {
            for (let aliveCoord of this.aliveCoords) {
                if (aliveCoord.x == x &&
                    aliveCoord.y == y) {
                    return true
                }
            }
    
            return false;
        }
    }
}

let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let grid = new GameOfLife.Grid(canvas);
canvas.getContext("2d");


console.log(canvas);
console.log(grid);

function add(x: number, y: number) {
    let sum = x + y;
    console.log('result', sum);
}
function concat(x: string, y: string) {
    let concatenatedValue = x + y;
    console.log('result', concatenatedValue);
}

add(3, 4);
concat("hello", "world");
console.log("cellsize", grid.cellSize);