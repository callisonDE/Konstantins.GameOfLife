class Grid
{
    constructor(canvasHost)
    {
        canvasHost ??= document.getElementById("canvas");

        this.cellSize = 40;
        this.hostElement = canvasHost;
        this.context = canvasHost.getContext("2d");
    }
    
    clear()
    {
        this.context.clearRect(0, 0, this.hostElement.width, this.hostElement.height);
    }
    
    setAlive(x, y)
    {
        this.context.fillStyle = "black";
        this.context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }
}