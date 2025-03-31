class Grid
{
    constructor(canvasHost)
    {
        canvasHost ??= document.getElementById("canvas");

        this.cellSize = 10;
        this.hostElement = canvasHost;
        this.context = canvasHost.getContext("2d");
    }
    
    clear()
    {
        this.hostElement.clear();
    }
    setAlive(x, y)
    {
        this.context.fillStyle = "black";
        this.context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }
}