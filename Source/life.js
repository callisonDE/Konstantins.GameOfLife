class Cell
{
    constructor(isAlive)
    {
        console.log('Neue Cell erstellt.');
        this.isAlive = isAlive;
    }
}

// Grid erstellen
let grid = new Grid();

for(let i = 0; i < 10; i++)
{
    let isAlive = (i != 1);
    let cell = new Cell(isAlive);
    console.log(cell.isAlive); 
}

// erste Zellen lebendig machen
//grid.setAlive(0, 0);
// grid.clear();