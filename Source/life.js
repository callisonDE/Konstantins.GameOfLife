class Cell
{
    constructor(isAlive, x, y)
    {
        console.log('Neue Cell erstellt.');
        this.isAlive = isAlive;
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
        
        return new Generation(this.nr + 1, cellsInNextGeneration);
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

let grid = new Grid();
let cells = [
    new Cell(true, 0, 0), 
    new Cell(true, 0, 1), 
    new Cell(true, 1, 1),
    new Cell(true, 6, 4),
    new Cell(false, 0, 0)
];

let g0 = new Generation(0, cells);
drawGenerationOnGrid(grid, g0);

let g1 = g0.calculateNextGeneration();
drawGenerationOnGrid(grid, g1);