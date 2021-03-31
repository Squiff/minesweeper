import { Minesweeper } from './modules/minesweeper.js';
import { NewGameForm } from './modules/newgameform.js';
import { gameOptions } from './modules/gameoptions.js';
import { Scores } from './modules/scores.js';
import { ScoreSelect } from './modules/scoreselect.js';
import { watchIcons } from './modules/iconManager';

export class App {
    constructor() {
        this.components = {
            scoreSelect: new ScoreSelect(),
            scores: new Scores(),
            minesweeper: new Minesweeper(gameOptions.easy),
            newGameForm: new NewGameForm(),
        };

        this.startUp();
    }

    startUp() {
        watchIcons();
        this.bindAppEvents();
        this.components.scoreSelect.selectDifficulty('easy');
    }

    bindAppEvents() {
        const { scoreSelect, scores, minesweeper, newGameForm } = this.components;

        newGameForm.events.newGame.addEventListener((options) => minesweeper.newGame(options));
        minesweeper.events.gameWon.addEventListener(({ difficulty, time }) => this.addHighScore(difficulty, time));
        scoreSelect.events.optionClicked.addEventListener((difficulty) => scores.renderTable(difficulty));
    }

    addHighScore(difficulty, time) {
        this.components.scores.addHighScore(difficulty, time);
        this.components.scoreSelect.selectDifficulty(difficulty);
    }
}
