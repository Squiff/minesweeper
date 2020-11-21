export class NewGameForm{
    constructor(minesweeper, options){
        this.minesweeper = minesweeper;
        this.difficultyOptions = options;

        this.bindEvents();
    }

    bindEvents(){
        $('#startGame').click(this.startGame.bind(this));
    }

    startGame(e){
        const difficulty = $('#difficulty').val();
        const options = this.difficultyOptions[difficulty];

        e.preventDefault();
        this.minesweeper.newGame(options);
    }
}