import { AppEvent } from './appevent.js';
import { gameOptions } from './gameoptions.js';

export class NewGameForm {
    constructor() {
        this.events = {
            newGame: new AppEvent(), // args: {...options, difficulty}
        };

        this.elements = {
            startBtn: document.getElementById('startGame'),
            difficultySelect: document.getElementById('difficulty'),
        };

        this.bindEvents();
    }

    bindEvents() {
        this.elements.startBtn.addEventListener('click', this.startGame.bind(this));
    }

    startGame(e) {
        e.preventDefault();

        const difficulty = this.elements.difficultySelect.value;
        const options = gameOptions[difficulty];

        this.events.newGame.trigger(options);
    }
}
