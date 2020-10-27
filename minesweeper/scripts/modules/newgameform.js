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
        e.preventDefault();

        const difficulty = $('#difficulty').val();
        const options = this.difficultyOptions[difficulty];

        this.minesweeper.newGame(options);
    }
}