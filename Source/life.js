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
    let cell = new Cell(true);
    console.log(cell.isAlive);
    
    // grid.setAlive(0, i);
}

// erste Zellen lebendig machen
//grid.setAlive(0, 0);


// grid.clear();