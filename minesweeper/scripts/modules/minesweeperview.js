import { CustomEvent } from "./customevent.js";
import * as Utilities from './utilities.js'


/** Class responsible for the Minesweeper UI */
export class MinesweeperView{

    /** @param {jQuery} container - The Minesweeper container
     *  @param {{rows: number, columns: number}} options - options specifying grid dimensions */
    constructor(container, options, scores){
        this.container = container;
        this.options = options;
        this.selectedControl = null;
        this.cellsize = 22;

        this.events = {
            cellClicked: new CustomEvent(),
            newGame: new CustomEvent()
        }

        this.bindEvents();
        this.newGame(options);
    }

    /** Set UI event listeners */
    bindEvents(){
        const minesweeper = this;
        const grid = this.container.find('.minesweeper-grid');
        const playAgainBtn = this.container.find('#play-again');
        const controls = this.container.find('.minesweeper-control');
        
        // Grid Clicked
        grid.click(minesweeper.gridClicked.bind(this));

        // Grid Right Click
        grid.mouseup(function(e){
            const cell = $(e.target).closest('.minesweeper-cell');

            if (e.button === 2) {
                minesweeper.flagCell(cell);
            }
        })

        // Disable right click context menu on grid
        grid.contextmenu(() => false);

        // Play Again Button Click
        playAgainBtn.click(function(e){
            minesweeper.events.newGame.trigger();
        })

        // Controls Clicked
        controls.click(function(e){
            minesweeper.selectControl(this);
        })
    }

    /** Event handler for grid left click */
    gridClicked(e){
        const cell = $(e.target).closest('.minesweeper-cell');

        if (cell.hasClass('minesweeper-cell-unrevealed') === false)
            return; // already been clicked. Do Nothing.

        // Action depending on selected control
        if (this.selectedControlName() === 'flag')
            this.flagCell(cell);
        else {
            const index = cell.index();
            this.events.cellClicked.trigger(index);
        }
    }

    /** Start a new game */
    newGame(options){
        const control = this.container.find('#minesweeper-flag-control').get(0);        
        this.container.find('.minesweeper-bottom').hide();

        this.options = options;
        this.setTime(0);
        this.selectControl(control);
        this.createGrid();
    }

    /** Start a new game with the same options */
    restartGame(){
        this.newGame(this.options); // pass in same options
    }

    /** create the cells for the main grid */
    createGrid(){
        const grid = this.container.find('.minesweeper-grid');
        const cellCount = this.options.columns * this.options.rows;

        grid.empty();

        for (let i = 0; i < cellCount; i++) {
            grid.append('<div class="minesweeper-cell minesweeper-cell-unrevealed"></div>');
        }

        grid.css('grid-template-columns', `repeat(${this.options.columns}, 1fr)`);

        this.squareCells();
    }

    /** Manages the overall grid size to ensure each cell is kept square*/
    squareCells(){
        const gridWidth = this.cellsize * this.options.columns;
        const gridHeight = this.cellsize * this.options.rows;
        const grid = this.container.find('.minesweeper-grid');

        grid.height(gridHeight);
        grid.width(gridWidth);
    }

    /**
     * Set the selected control
     * @param {HTMLElement} element - the control element to be selected
     */
    selectControl(element){
        if(this.selectedControl)
            this.selectedControl.classList.remove('selected');

        this.selectedControl = element;
        element.classList.add('selected');
    }

    /** get the selected control name (data-control-name attribute on the element) */
    selectedControlName(){
        return this.selectedControl.getAttribute('data-control-name');
    }

    /** reveals the cell contents for the cell at the specified index. Value -1 indicates a bomb */
    revealCell(index, value){
        const grid = this.container.find('.minesweeper-grid');
        const cell = grid.children().eq(index);

        cell.removeClass('flag');
        cell.removeClass('minesweeper-cell-unrevealed');
        cell.addClass('minesweeper-cell-revealed')

        if (value === 0){
            cell.html('');
        }  else if (value > 0) {
            cell.html(value);
            cell.addClass(`value${value}`)
        } else {
            this.addBomb(cell);
            cell.addClass('valuebomb')
        }
    }

    /** Show all the bomb locations
     * @param {number[]} bombPositions - the indices of all the bombs
    */
    showBombs(bombPositions){
        const grid = this.container.find('.minesweeper-grid');
        const cells = grid.children()

        bombPositions.forEach(b => {
            this.addBomb(cells.eq(b));
        })
    }

    /** 
     * Add bomb icon to the provided cell
     * @param {jQuery} cell - cell to update
     */
    addBomb(cell){
        cell.html('<i class="fas fa-bomb"></i>');
        cell.removeClass('flag'); // in case cell was flagged
    }

    /** 
     * Toggle the flag icon on a cell
     * @param {jQuery} cell - cell to toggle
     */
    flagCell(cell){
        if (cell.hasClass('minesweeper-cell-unrevealed') === false)
            return

        if (cell.hasClass('flag')){
            cell.html('');
        } else {
            cell.html('<i class="fas fa-flag"></i>');
        }

        cell.toggleClass('flag');
    }

    /** Set the Timer Value. ms is elapsed milliseconds */
    setTime(ms){
        // check if there is an hour
        const hasHour = ms > (1000 * 60 * 60) ;
        const format = hasHour ? 'HH:mm:ss' : 'mm:ss';
        const time = Utilities.formatTime(ms, format);
      
        $('#time').html(time);
    }

    

    /** Win routine */
    winGame(){
        const resultContainer = this.container.find('.minesweeper-result');
        resultContainer.html('You Win!');
        resultContainer.css('color','green');
        this.container.find('.minesweeper-bottom').show();
    }

    /** Lose routine */
    loseGame(args){
        // show the clicked bomb
        this.revealCell(args.index, -1);

        // show all other bombs
        this.showBombs(args.bombs);

        const resultContainer = this.container.find('.minesweeper-result');
        resultContainer.html('You Lose!');
        resultContainer.css('color','red');
        this.container.find('.minesweeper-bottom').show();

    }
}
