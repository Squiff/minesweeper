import { AppEvent } from './appevent.js';
import { formatTime, getElementArray, elementIndex } from './utilities.js';

/** Class responsible for the Minesweeper UI */
export class MinesweeperView {
    /** @param {jQuery} container - The Minesweeper container
     *  @param {{rows: number, columns: number}} options - options specifying grid dimensions */
    constructor(options) {
        this.container = document.querySelector('.minesweeper');
        this.options = options;
        this.selectedControl = null;
        this.cellsize = 22;

        this.events = {
            cellClicked: new AppEvent(),
            newGame: new AppEvent(),
            cellFlagged: new AppEvent(),
        };

        this.bindEvents();
        this.newGame(options);
    }

    /** Set UI event listeners */
    bindEvents() {
        const minesweeper = this;
        const grid = this.container.querySelector('.minesweeper-grid');
        const playAgainBtn = this.container.querySelector('#play-again');
        const controls = getElementArray('.minesweeper-control');

        // Grid Clicked
        grid.addEventListener('click', minesweeper.gridClicked.bind(this));

        // Grid Right Click
        grid.addEventListener('mouseup', minesweeper.griRightClick.bind(this));

        // Disable right click context menu on grid
        grid.addEventListener('contextmenu', (e) => e.preventDefault(e));

        // Play Again Button Click
        playAgainBtn.addEventListener('click', () => minesweeper.events.newGame.trigger());

        // Controls Clicked
        controls.forEach((c) => {
            c.addEventListener('click', (e) => minesweeper.selectControl(e.target));
        });
    }

    /** Event handler for grid left click */
    gridClicked(e) {
        // get the clicked cell
        const cell = e.target.closest('.minesweeper-cell');

        // handle dead zone between cells
        if (!cell) return;

        // already been clicked. Do Nothing.
        if (cell.classList.contains('minesweeper-cell-unrevealed') === false) return;

        const index = elementIndex(cell);

        // Action depending on selected control
        if (this.selectedControlName() === 'flag') {
            this.events.cellFlagged.trigger(index);
        } else {
            this.events.cellClicked.trigger(index);
        }
    }

    griRightClick(e) {
        if (e.button !== 2) return;

        const cell = e.target.closest('.minesweeper-cell');
        const index = elementIndex(cell);

        this.events.cellFlagged.trigger(index);
    }

    /** Start a new game */
    newGame(options) {
        const control = this.container.querySelector('#minesweeper-flag-control');
        this.container.querySelector('.minesweeper-bottom').style.removeProperty('display');

        this.options = options;
        this.setTime(0);
        this.selectControl(control);
        this.createGrid();
    }

    /** Start a new game with the same options */
    restartGame() {
        this.newGame(this.options); // pass in same options
    }

    /** create the cells for the main grid */
    createGrid() {
        const grid = this.container.querySelector('.minesweeper-grid');
        const cellCount = this.options.columns * this.options.rows;

        const cells = [];

        for (let i = 0; i < cellCount; i++) {
            cells.push('<div class="minesweeper-cell minesweeper-cell-unrevealed"></div>');
        }

        grid.innerHTML = cells.join('');

        grid.style.setProperty('grid-template-columns', `repeat(${this.options.columns}, 1fr)`);

        this.squareCells();
    }

    /** Manages the overall grid size to ensure each cell is kept square*/
    squareCells() {
        const gridWidth = this.cellsize * this.options.columns;
        const gridHeight = this.cellsize * this.options.rows;
        const grid = this.container.querySelector('.minesweeper-grid');

        grid.style.setProperty('height', `${gridHeight}px`);
        grid.style.setProperty('width', `${gridWidth}px`);
    }

    /**
     * Set the selected control
     * @param {HTMLElement} element - the control element to be selected
     */
    selectControl(element) {
        if (this.selectedControl) this.selectedControl.classList.remove('selected');

        this.selectedControl = element;
        element.classList.add('selected');
    }

    /** get the selected control name (data-control-name attribute on the element) */
    selectedControlName() {
        return this.selectedControl.getAttribute('data-control-name');
    }

    /** reveals the cell contents for the cell at the specified index. Value -1 indicates a bomb */
    revealCell(index, value) {
        const grid = this.container.querySelector('.minesweeper-grid');
        const cell = Array.from(grid.children)[index];

        cell.classList.remove('flag');
        cell.classList.remove('minesweeper-cell-unrevealed');
        cell.classList.add('minesweeper-cell-revealed');

        if (value === 0) {
            cell.innerHTML = '';
        } else if (value > 0) {
            cell.innerHTML = value;
            cell.classList.add(`value${value}`);
        } else {
            this.addBomb(cell);
            cell.classList.add('valuebomb');
        }
    }

    /** Show all the bomb locations
     * @param {number[]} bombPositions - the indices of all the bombs
     */
    showBombs(bombPositions) {
        const grid = this.container.querySelector('.minesweeper-grid');
        const cells = Array.from(grid.children);

        bombPositions.forEach((b) => {
            this.addBomb(cells[b]);
        });
    }

    /**
     * Add bomb icon to the provided cell
     * @param {jQuery} cell - cell to update
     */
    addBomb(cell) {
        cell.innerHTML = '<i class="fas fa-bomb"></i>';
        cell.classList.remove('flag'); // in case cell was flagged
    }

    /**
     * Toggle the flag icon on a cell
     * @param {jQuery} cell - cell to toggle
     */
    flagCell(index) {
        const grid = this.container.querySelector('.minesweeper-grid');
        const cell = Array.from(grid.children)[index];

        if (cell.classList.contains('minesweeper-cell-unrevealed') === false) return;

        if (cell.classList.contains('flag')) {
            cell.innerHTML = '';
            cell.classList.remove('flag');
        } else {
            cell.innerHTML = '<i class="fas fa-flag"></i>';
            cell.classList.add('flag');
        }
    }

    /** Set the Timer Value. ms is elapsed milliseconds */
    setTime(ms) {
        // check if there is an hour
        const hasHour = ms > 1000 * 60 * 60;
        const format = hasHour ? 'HH:mm:ss' : 'mm:ss';
        const time = formatTime(ms, format);

        this.container.querySelector('#time').innerHTML = time;
    }

    /** Win routine */
    winGame() {
        const resultContainer = this.container.querySelector('.minesweeper-result');
        resultContainer.innerHTML = 'You Win!';
        resultContainer.style.setProperty('color', 'green');

        this.container.querySelector('.minesweeper-bottom').style.setProperty('display', 'block');
    }

    /** Lose routine */
    loseGame(args) {
        // show the clicked bomb
        this.revealCell(args.index, -1);

        // show all other bombs
        this.showBombs(args.bombs);

        const resultContainer = this.container.querySelector('.minesweeper-result');
        resultContainer.innerHTML = 'You Lose!';
        resultContainer.style.setProperty('color', 'red');
        this.container.querySelector('.minesweeper-bottom').style.setProperty('display', 'block');
    }
}
