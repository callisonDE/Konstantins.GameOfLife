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

    set(x, y, color)
    {
        this.context.fillStyle = color;
        this.context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }
}