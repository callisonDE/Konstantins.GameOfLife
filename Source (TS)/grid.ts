namespace GameOfLife
{
    export class Grid
    {
        private readonly _cellSize : number;
        private readonly _hostElement : HTMLCanvasElement;
        private readonly _context : CanvasRenderingContext2D;
    
        constructor(canvasHost : HTMLCanvasElement | null = null)
        {
            canvasHost ??= document.getElementById("canvas") as HTMLCanvasElement;
    
            this._cellSize = 10;
            this._hostElement = canvasHost;
            this._context = canvasHost.getContext("2d")!;
        }
        
        public get cellSize() : number
        {
            return this._cellSize;
        }
        
        public clear()
        {
            this._context.clearRect(0, 0, this._hostElement.width, this._hostElement.height);
        }
        
        public set(x: number, y: number, color : string | CanvasGradient)
        {
            this._context.fillStyle = color;
            this._context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
        }
    }
}