import { MinesweeperModel } from "./minesweepermodel.js";
import { MinesweeperView } from "./minesweeperview.js";

/* A Game of Minesweeper */
export class Minesweeper{
    /** @param {string} selector - the jQuery selector for the minesweeper container */
    constructor(selector, options){
        const minesweeper = $(selector);
        this.view = new MinesweeperView(minesweeper, options);
        this.model = new MinesweeperModel(options);

        this.bindViewEvents();
    }

    /** set view listeners */
    bindViewEvents(){
        this.view.events.cellClicked.addEventListener(this.cellClicked.bind(this));
        this.view.events.newGame.addEventListener(this.restartGame.bind(this));
    }

    /** model setter - set model listeners */
    set model(newModel){
        this._model = newModel;
        newModel.events.cellRevealed.addEventListener(this.cellRevealed.bind(this));
        newModel.events.gameOver.addEventListener(this.gameOver.bind(this));
        newModel.events.gameWon.addEventListener(this.gameWon.bind(this));
    }

    get model(){
        return this._model;
    }

    cellClicked(index){
        this.model.revealCell(index);
    }

    cellRevealed(cellArgs){
        this.view.revealCell(cellArgs.index, cellArgs.bombs)
    }

    gameOver(args){
        this.view.loseGame(args);
    }

    gameWon(){
        this.view.winGame();
    }
    
    /** restart game with same options */
    restartGame(){
        this.view.restartGame();
        this.model = new MinesweeperModel(this.model.options);
    }

    newGame(options){
        this.view.newGame(options);
        this.model = new MinesweeperModel(options);
    }
}