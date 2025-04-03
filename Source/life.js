class Cell
{
    constructor(isAlive, x, y)
    {
        //console.log('Neue Cell erstellt.');
        this.isAlive = isAlive;
        this.isDead = !isAlive;
        this.x = x;
        this.y = y;
    }
}

class GenerationBuilder
{
    constructor(gridSize)
    {
        this.gridSize = gridSize;
        this.cells = [];
        this.insertAllDeadCells();
    }

    build()
    {
        return new Generation(0, this.cells);
    }
    makeAlive(x, y)
    {
        this.insertCell(x, y, true);
        return this;
    }
    insertCell(x, y, alive)
    {
        let index = x + this.gridSize * y;
        this.cells[index] = new Cell(alive, x, y);
    }
    insertAllDeadCells()
    {
        for(let x = 0; x < this.gridSize; x++)
        for(let y = 0; y < this.gridSize; y++)
        {
            this.insertCell(x, y, false);
        }
    }
}

class Generation
{
    constructor(nr, cells)
    {
        // Erstelle eine Eigenschaft "nr" auf dem neuen Objekt (this)
        this.nr = nr;
        this.cells = cells;

        console.log(`Generation Nr. ${nr} erstellt: ${cells.length} Zellen`);
    }
    
    calculateNextGeneration()
    {
        let cellsInNextGeneration = [];
        
        for(let cell of this.cells)
        {
            let aliveInNextGeneration = this.isCellAliveInNextGeneration(cell);
            let cellInNextGeneration = new Cell(aliveInNextGeneration, cell.x, cell.y);
            cellsInNextGeneration.push(cellInNextGeneration)
        }
        
        return new Generation(this.nr + 1, cellsInNextGeneration);
    }
    isCellAliveInNextGeneration(cell)
    {
        let numberOfNeighborsAlive = this.calculateNumberOfNeighborsAlive(cell);

        if(cell.isAlive)
        {
            // rule #0: Any live cell with fewer than two live neighbours dies, as if by underpopulation.
            if (numberOfNeighborsAlive < 2)
            {
                return false;
            }
    
            // rule #1: Any live cell with two or three live neighbours lives on to the next generation.
            if (numberOfNeighborsAlive == 2 || numberOfNeighborsAlive == 3)
            {
                // this.cellsInNextGeneration.push(cell)
                return true;
            }
            
            // rule #2: Any live cell with more than three live neighbours dies, as if by overpopulation.
            return false;
        }
        // rule #3: Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        else if (cell.isDead && numberOfNeighborsAlive == 3)
        {
            // this.cellsInNextGeneration.push(cell);
            return true;
        }
        return false;
    }
    getNeighborsOfNextGeneration(cell)
    {
        return this.getNeighborsDead(cell)
    }
    calculateNumberOfNeighborsAlive(cell)
    {
        let neighbors = this.getNeighbors(cell);
        let numberOfNeighborsAlive = this.countNumberOfCellsAlive(neighbors);

        return numberOfNeighborsAlive;
    }
    calculateNumberOfNeighborsDead(cell)
    {
        let neighbors = this.getNeighbors(cell);
        let numberOfNeighborsDead = this.countNumberOfCellsDead(neighbors);

        return numberOfNeighborsDead;
    }
    getNeighbors(cell)
    {
        let neighbors = [];

        for(let x = cell.x - 1; x <= cell.x + 1; x++)
        {
            for(let y = cell.y - 1; y <= cell.y + 1; y++)
            {
                // ignore cell itself
                if (x == cell.x && y == cell.y)
                {
                    continue;
                }

                let cellAtXY = this.getCellAtCoords(x, y);

                if(cellAtXY == null)
                {
                    continue;
                }
                
                neighbors.push(cellAtXY);
            }
        }
        return neighbors;
    }
    getNeighborsDead(cell)
    {
        let neighborsDead = [];

        for(let x = cell.x - 1; x <= cell.x + 1; x++)
        {
            for(let y = cell.y - 1; y <= cell.y + 1; y++)
            {
                // ignore cell itself
                if (x == cell.x && y == cell.y)
                {
                    continue;
                }

                let cellAtXY = this.getDeadCellAtCoords(x, y);

                if(cellAtXY == null && cell.isDead)
                {
                    cellAtXY = new Cell(cell.isDead, cell.x, cell.y)
                }
                
                neighborsDead.push(cellAtXY);
            }
        }
        return neighborsDead;
    }
    countNumberOfCellsAlive(cells)
    {
        let numberOfCellsAlive = 0;

        for(let cell of cells)
        {
            if(cell.isAlive)
            {
                numberOfCellsAlive++;
            }
        }

        return numberOfCellsAlive;
    }
    countNumberOfCellsDead(cells)
    {
        let numberOfCellsDead = 0;

        for(let cell of cells)
        {
            if(cell.isDead)
            {
                numberOfCellsDead++;
            }
        }

        return numberOfCellsDead;
    }
    getCellAtCoords(x,y)
    {
        for(let cell of this.cells)
        {
            if (cell.x == x && cell.y == y)
            {
                return cell
            }
        }
       
        
        /* Funktioniert nicht wie erwartet
        if(x >= 0 && y >= 0)
        {
            return new Cell(false, x, y);
        }
        */

        return null;
    }
    getDeadCellAtCoords(x,y)
    {
        for(let cell of this.cells)
        {
            if (cell.x == x && cell.y == y)
            {
                return cell
            }
        }

        return null;
    }
}

function drawGenerationOnGrid(grid, generation)
{
    grid.clear();

    for(let i = 0; i < generation.cells.length; i++)
    {
        let cell = generation.cells[i];
        let color = cell.isAlive ? "black" : "white" /*"rgb(72, 72, 72)"*/;
        grid.set(cell.x, cell.y, color);
    }
}

function createStartGeneration()
{
    return new GenerationBuilder(100)
        .makeAlive(0, 2)
        .makeAlive(1, 0)
        .makeAlive(1, 2)
        .makeAlive(2, 1)
        .makeAlive(2, 2)
        .build();
}

let grid = new Grid();
let currentGeneration = createStartGeneration();
console.log(currentGeneration);
drawGenerationOnGrid(grid, currentGeneration);

function next()
{
    currentGeneration = currentGeneration.calculateNextGeneration();
    drawGenerationOnGrid(grid, currentGeneration);
}

function play()
{
    setInterval(next, 100);
}