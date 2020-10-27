import { CustomEvent } from "./customevent.js";

/** Class responsible for the Minesweeper game logic */
export class MinesweeperModel{
    /** @param {{rows: number, columns: number, bombCount: number}} options */
    constructor(options){
        this.options = options;
        this.bombs = [];                        // numbers[]: bomb index locations in grid
        this.grid = [];                         // numbers[]: values: null: unrevealed cell, 0-8: revealed value, -1: bomb
        this.gameState = 0;                     
        this.remainingClearCells = (options.rows * options.columns) - options.bombCount;

        this.events = {
            cellRevealed: new CustomEvent(),    // args: {index: number, bombs: number[]}
            gameOver: new CustomEvent(),        // args: {index: number, bombs: number[]}
            gameWon: new CustomEvent()          // args: none
        }

        this.init();
    }

    /** initiate the game: setup grid, bomb locations */
    init(){
        const totalCells = this.options.rows * this.options.columns;
        const bombCount = this.options.bombCount;
        // randomly generate the bomb positions
        this.bombs = this.randomSet(totalCells, bombCount);

        this.grid = new Array(totalCells).fill(null);

        this.bombs.forEach(bomb => {
            this.grid[bomb] = -1
        })
    }

    /** generates an array of length [count] of unique random numbers between 0 and [max] */ 
    randomSet(max, count){
        const available = new Array(max);
        const randomNumbers = new Array(count);
    
        // setup array with numbers 0 -> max
        for (let i = 0; i < max; i++) {
            available[i] = i;
        }
    
        // select available numbers
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * available.length)
            randomNumbers[i] = available[randomIndex];  // add to our selected numbers
            available.splice(randomIndex,1);            // remove so same number is not selected
        }
    
        return randomNumbers;
    }

    /** get all neighbouring indices in the grid from the selected index */
    getNeighbours(index){
        const output = [];
        const rows = this.options.rows;
        const columns = this.options.columns;

        const indexRow = Math.floor(index / columns)
        const indexCol = index % columns;

        for (let colOffset = -1; colOffset <= 1; colOffset++) 
            for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
                const rowCheck = indexRow + rowOffset;
                const colCheck = indexCol + colOffset;
                
                // check if the row and column are in the grid
                if (rowCheck >= 0 && 
                    rowCheck < rows &&
                    colCheck >= 0 &&   
                    colCheck < columns &&
                    (colOffset !== 0 || rowOffset !== 0)
                    ) {
                    
                    const indexCheck = (rowCheck * columns) + colCheck
                    output.push(indexCheck);
                }
            }
        
        return output;
    }

    canReveal(index){
        return this.grid[index] === null;
    }

    unrevealedNeighbours(index){
        const neighbours = this.getNeighbours(index);
        return neighbours.filter(n => this.canReveal(n))
    }

    /** count the number of bombs surrounding the provided index */
    bombCount(index){
        const neighbours = this.getNeighbours(index);
        let total = 0;

        neighbours.forEach(n => {
            if (this.grid[n] === -1)
                total++
        })

        return total;
    }

    /* reveal the cell at the provided index */
    revealCell(index){
        if (this.gameState != 0) 
            return; // game is finished

        if (this.grid[index] === -1){
            this.gameState = -1;
            this.events.gameOver.trigger({index: index, bombs: this.bombs});
        } else if (this.canReveal(index)){            
            const bombs = this.bombCount(index);
            this.grid[index] = bombs;
            this.remainingClearCells--;

            this.events.cellRevealed.trigger({index: index, bombs: bombs});

            // no bombs. reveal all neighbouring cells
            if (bombs === 0) {
                const toReveal = this.unrevealedNeighbours(index);
                toReveal.forEach(x => this.revealCell(x));
            }

            // check if the game is complete
            if (this.remainingClearCells === 0){
                this.gameState = 1;
                this.events.gameWon.trigger();
            }
        }
    }
}