namespace GameOfLife {
    export class Coords
    {
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        public readonly x: number;
        public readonly y: number;

        public getNeighbors(): Coords[] {
            let neighbors: Coords[] = [];

            for (let x = this.x - 1; x <= this.x + 1; x++)
                for (let y = this.y - 1; y <= this.y + 1; y++) {
                    if (x == this.x &&
                        y == this.y) {
                        continue;
                    }

                    neighbors.push(new Coords(x, y));
                }

            return neighbors;
        }
        public move(vector: Coords): Coords
        {
            return new Coords(this.x + vector.x, this.y + vector.y);
        }
    }

    export class Rules {
        public static doesAliveCoordRemainAlive(NeighborsAlive: number): boolean {
            // rule #1: Any live cell with two or three live neighbours lives on to the next generation.
            if (NeighborsAlive == 2 || NeighborsAlive == 3) {
                return true;
            }

            // rule #0: Any live cell with fewer than two live neighbours dies, as if by underpopulation.
            // rule #2: Any live cell with more than three live neighbours dies, as if by overpopulation.
            return false;
        }

        public static doesDeadCoordTurnAlive(NeighborsAlive: number): boolean {
            // rule #3: Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
            return NeighborsAlive == 3;
        }
    }

    class SetOfCoords {
        private readonly _coords = [];

        constructor(gridSize: number) {
            this.gridSize = gridSize;
        }

        public readonly gridSize: number;

        public hasCoords(x: number, y: number): boolean {
            let index: number = this.getIndex(x, y);
            return this._coords[index] != null;
        }
        public insert(coords: Coords) {
            let index: number = this.getIndex(coords.x, coords.y);
            this._coords[index] = coords;
        }
        public getCoords(): Coords[] {
            let coords: Coords[] = [];

            for (let coord of this._coords) {
                if (!coord) {
                    continue;
                }

                coords.push(coord);
            }

            return coords;
        }

        private getIndex(x: number, y: number): number {
            return x + this.gridSize * y;
        }
    }

    export class Builder
    {
        private readonly _setOfAliveCoords: SetOfCoords;

        constructor(gridSize: number) {
            this._setOfAliveCoords = new SetOfCoords(gridSize);
        }

        public build(): Generation {
            return new Generation(0, this._setOfAliveCoords.getCoords());
        }
        public makeAlive(x: number, y: number): this {
            this._setOfAliveCoords.insert(new Coords(x, y));
            return this;
        }
        private isAlive(x: number, y: number): boolean {
            return this._setOfAliveCoords.hasCoords(x, y);
        }
    }

    export class Generation
    {
        constructor(nr: number, aliveCoords: Coords[]) {
            this.nr = nr;
            this.aliveCoords = aliveCoords;
        }
        
        public readonly nr: number;
        public readonly aliveCoords: Coords[];

        public calculateNextGeneration(gridSize: number): Generation {
            let AliveCoordsInNextGeneration: SetOfCoords = new SetOfCoords(gridSize);

            // apply rules to alive coords
            for (let aliveCoord of this.aliveCoords)
            {
                let numberOfAliveNeighbors = this.calculateNumberOfNeighborsAlive(aliveCoord);
                
                if (Rules.doesAliveCoordRemainAlive(numberOfAliveNeighbors))
                {
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

        private getDeadNeighborCoordsOfAliveCoords(): Coords[] {
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
        private calculateNumberOfNeighborsAlive(coords: Coords): number {
            let neighbors: Coords[] = coords.getNeighbors();
            return this.countNumberOfCoordsAlive(neighbors);
        }
        private countNumberOfCoordsAlive(coords: Coords[]): number {
            let coordsAlive = 0;

            for (let coord of coords)
            {
                if (this.hasAliveCoords(coord.x, coord.y))
                {
                    coordsAlive++;
                }
            }
            
            return coordsAlive;
        }
        private hasAliveCoords(x: number, y: number): boolean {
            for (let aliveCoord of this.aliveCoords)
            {
                if (aliveCoord.x == x &&
                    aliveCoord.y == y)
                {
                    return true
                }
            }

            return false;
        }
    }

    export class StartGenerationImporter
    {
        public import(text: string, startCoord: Coords): Generation
        {
            let coordsForStartGeneration: Coords[] = [];
            let singleRows = text.split('\n')
            
            for (let r = 0; r < singleRows.length; r++)
            {
                let row = singleRows[r]
                
                for (let c = 0; c < row.length; c++)
                {
                    if (row[c] == 'O')
                    {
                        let originalCoords = new Coords(c, r);
                        let targetCoords = originalCoords.move(startCoord);
                        
                        coordsForStartGeneration.push(targetCoords);
                    }
                }
            }
            return new Generation(0, coordsForStartGeneration)
        }
    }
}

function drawGenerationOnGrid(grid, generation) {
    grid.clear();

    for (let aliveCoords of generation.aliveCoords) {
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
    let timeBetweenGenerations = document.getElementById('timeBetweenGenerations') as HTMLInputElement;
    setInterval(next, timeBetweenGenerations.valueAsNumber);
}

function importFromTextArea() {
    let importer = new GameOfLife.StartGenerationImporter();
    let importTextArea = document.getElementById('areaOfOwnStartGeneration') as HTMLTextAreaElement;
    currentGeneration = importer.import(importTextArea.value, new GameOfLife.Coords(50, 50));
    drawGenerationOnGrid(grid, currentGeneration);
}
let gridSize = 100;
let grid = new GameOfLife.Grid();
let currentGeneration = createStartGeneration(gridSize);
drawGenerationOnGrid(grid, currentGeneration);