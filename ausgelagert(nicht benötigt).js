class OwnGeneration
    constructor()
    {
        this.allRows = [];
        this.textOfRows = document.getElementById("areaOfOwnStartGeneration").textContent;
    }
    calculateNumberAndLengthOfRows()
    {
        let numberOfRows = this.calculateNumberOfRows();
        console.log(this.allRows)
        let lenthOfRows = this.calculateLenghtOfRows();
        return numberOfRows && lenthOfRows
    }  

    calculateNumberOfRows()
    {
        console.log(this.textOfRows)
        let splittedRows = this.textOfRows.split('\n');
        splittedRows.forEach((word) => {
            this.allRows.push(word);
        });
        return this.allRows.length
    }

    calculateLenghtOfRows()
    {
        let lengthOfRow = [] ;
        for (let row of this.allRows)
        {
            let currentRowSplit = row.split('') ;
            lengthOfRow.push(currentRowSplit)
            /*
            currentRowSplit.forEach((word) => {
                lengthOfRow.push(word);
            });
            */
       }
    return lengthOfRow
}


function insertOwnGeneration()
{
    let owngeneration = new OwnGeneration()
    console.log(owngeneration.calculateNumberAndLengthOfRows())
}