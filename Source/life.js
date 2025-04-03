class Coords
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    getNeighbors()
    {
        let neighbors = [];

        for(let x = this.x - 1; x <= this.x + 1; x++)
        for(let y = this.y - 1; y <= this.y + 1; y++)
        {
            // ignore coords themselves
            if (x == this.x && 
                y == this.y)
            {
                continue;
            }
            
            neighbors.push(new Coords(x, y));
        }

        return neighbors;
    }
}

class Rules
{
    static doesAliveCoordRemainAlive(numberOfNeighborsAlive)
    {
        // rule #1: Any live cell with two or three live neighbours lives on to the next generation.
        if (numberOfNeighborsAlive == 2 || numberOfNeighborsAlive == 3)
        {
            return true;
        }

        // rule #0: Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        // rule #2: Any live cell with more than three live neighbours dies, as if by overpopulation.
        return false;
    }

    static doesDeadCoordTurnAlive(numberOfNeighborsAlive)
    {
        // rule #3: Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        return numberOfNeighborsAlive == 3;
    }
}

class SetOfCoords
{
    constructor(gridSize)
    {
        this.gridSize = gridSize;
        this.coords = [];
    }

    hasCoords(x, y)
    {
        let index = this.getIndex(x, y);
        return this.coords[index];
    }
    insert(coords)
    {
        let index = this.getIndex(coords.x, coords.y);
        this.coords[index] = coords;
    }
    getIndex(x, y)
    {
        return x + this.gridSize * y;
    }
    getCoords()
    {
        let coords = [];

        for(let coord of this.coords)
        {
            if(!coord)
            {
                continue;
            }

            coords.push(coord);
        }

        return coords;
    }
}

class GenerationBuilder
{
    constructor(gridSize)
    {
        this.setOfAliveCoords = new SetOfCoords(gridSize);
    }

    build()
    {
        return new Generation(0, this.setOfAliveCoords.getCoords());
    }
    makeAlive(x, y)
    {
        this.setOfAliveCoords.insert(new Coords(x, y));
        return this;
    }
    isAlive(x, y)
    {
        return this.setOfAliveCoords.hasCoords(x, y);
    }
}

class Generation
{
    constructor(nr, aliveCoords)
    {
        this.nr = nr;
        this.aliveCoords = aliveCoords;
    }
    
    calculateNextGeneration(gridSize)
    {
        let setOfAliveCoordsInNextGeneration = new SetOfCoords(gridSize);
        
        // apply rules to alive coords
        for(let aliveCoord of this.aliveCoords)
        {
            let numberOfAliveNeighbors = this.calculateNumberOfNeighborsAlive(aliveCoord);
            
            if(Rules.doesAliveCoordRemainAlive(numberOfAliveNeighbors))
            {
                setOfAliveCoordsInNextGeneration.insert(aliveCoord);
            }
        }
        
        // apply rules to dead neighbor coords
        let deadNeighborCoords = this.getDeadNeighborCoordsOfAliveCoords();

        for(let deadNeighborCoord of deadNeighborCoords)
        {
            let numberOfAliveNeighbors = this.calculateNumberOfNeighborsAlive(deadNeighborCoord);
            
            if(Rules.doesDeadCoordTurnAlive(numberOfAliveNeighbors))
            {
                setOfAliveCoordsInNextGeneration.insert(deadNeighborCoord)
            }
        }

        return new Generation(this.nr + 1, setOfAliveCoordsInNextGeneration.getCoords());
    }
    getDeadNeighborCoordsOfAliveCoords()
    {
        let deadNeighborCoords = [];

        for(let aliveCoord of this.aliveCoords)
        {
           for(let neighborCoord of aliveCoord.getNeighbors())
           {
                if(neighborCoord.x < 0 ||
                   neighborCoord.y < 0)
                {
                    continue;
                }
                else if(!this.hasAliveCoords(neighborCoord.x, neighborCoord.y))
                {
                    deadNeighborCoords.push(neighborCoord);
                }
           }
        }

        return deadNeighborCoords;
    }
    calculateNumberOfNeighborsAlive(aliveCoord)
    {
        let neighbors = aliveCoord.getNeighbors();
        let numberOfNeighborsAlive = this.countNumberOfCoordsAlive(neighbors);

        return numberOfNeighborsAlive;
    }
    countNumberOfCoordsAlive(coords)
    {
        let numberOfCoordsAlive = 0;

        for(let coord of coords)
        {
            if(this.hasAliveCoords(coord.x, coord.y))
            {
                numberOfCoordsAlive++;
            }
        }

        return numberOfCoordsAlive;
    }
    hasAliveCoords(x, y)
    {
        for(let aliveCoord of this.aliveCoords)
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

function drawGenerationOnGrid(grid, generation)
{
    grid.clear();

    for(let aliveCoords of generation.aliveCoords)
    {
        grid.set(aliveCoords.x, aliveCoords.y, "black");
    }
}

function createStartGeneration(gridSize)
{
    return new GenerationBuilder(gridSize)
        .makeAlive(0, 2)
        .makeAlive(1, 0)
        .makeAlive(1, 2)
        .makeAlive(2, 1)
        .makeAlive(2, 2)
        .build();
}

let gridSize = 1000;
let grid = new Grid();
let currentGeneration = createStartGeneration(gridSize);
drawGenerationOnGrid(grid, currentGeneration);

function next()
{
    currentGeneration = currentGeneration.calculateNextGeneration(gridSize);
    console.log(currentGeneration);
    drawGenerationOnGrid(grid, currentGeneration);
}

function play()
{
    setInterval(next, 50);
}