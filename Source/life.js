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
                return true;
            }
            
            // rule #2: Any live cell with more than three live neighbours dies, as if by overpopulation.
            return false;
        }
        // rule #3: Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        else if (cell.isDead && numberOfNeighborsAlive == 3)
        {
            return true;
        }

        return false;
    }
    calculateNumberOfNeighborsAlive(cell)
    {
        let neighbors = this.getNeighbors(cell);
        let numberOfNeighborsAlive = this.countNumberOfCellsAlive(neighbors);

        return numberOfNeighborsAlive;
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
    getCellAtCoords(x,y)
    {
        for(let cell of this.cells)
        {
            if (cell.x == x && cell.y == y)
            {
                return cell
            }
        }
       
        /*
        // Funktioniert nicht wie erwarten
        if(x >= 0 && y >= 0)
        {
            return new Cell(false, x, y);
        }
        */

        return null;
    }
}

function drawGenerationOnGrid(grid, generation)
{
    grid.clear();

    for(let i = 0; i < generation.cells.length; i++)
    {
        let cell = generation.cells[i];
        let color = cell.isAlive ? "black" : "white";
        grid.set(cell.x, cell.y, color);
    }
}

function createStartGeneration()
{
    let cells = [
        new Cell(false, 0, 0),
        new Cell(false, 0, 1),
        new Cell(true, 0, 2),
        new Cell(false, 0, 3),
        new Cell(false, 0, 4),
        new Cell(false, 0, 5),

        new Cell(true, 1, 0),
        new Cell(false, 1, 1),
        new Cell(true, 1, 2),
        new Cell(false, 1, 3),
        new Cell(false, 1, 4),
        new Cell(false, 1, 5),

        new Cell(false, 2, 0),
        new Cell(true, 2, 1),
        new Cell(true, 2, 2),
        new Cell(false, 2, 3),
        new Cell(false, 2, 4),
        new Cell(false, 2, 5),

        new Cell(false, 3, 0),
        new Cell(false, 3, 1),
        new Cell(false, 3, 2),
        new Cell(false, 3, 3),
        new Cell(false, 3, 4),
        new Cell(false, 3, 5),

        new Cell(false, 4, 0),
        new Cell(false, 4, 1),
        new Cell(false, 4, 2),
        new Cell(false, 4, 3),
        new Cell(false, 4, 4),
        new Cell(false, 4, 5),
        
        new Cell(false, 5, 0),
        new Cell(false, 5, 1),
        new Cell(false, 5, 2),
        new Cell(false, 5, 3),
        new Cell(false, 5, 4),
        new Cell(false, 5, 5),
    ];
    
    return new Generation(0, cells);
}

let grid = new Grid();
let currentGeneration = createStartGeneration();
drawGenerationOnGrid(grid, currentGeneration);

function next()
{
    currentGeneration = currentGeneration.calculateNextGeneration();
    drawGenerationOnGrid(grid, currentGeneration);
}

function play()
{
    setInterval(next, 400);
}