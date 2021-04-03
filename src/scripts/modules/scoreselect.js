import { AppEvent } from './appevent.js';
import { getElementArray } from './utilities';

/** Group of difficulty options */
export class ScoreSelect {
    constructor() {
        this.elements = {
            btns: getElementArray('.score-option'),
        };

        this.events = {
            optionClicked: new AppEvent(), // args - data-value of clicked option
        };

        this.bindEvents();
    }

    bindEvents() {
        const btns = this.elements.btns;

        btns.forEach((b) => {
            b.addEventListener('click', (e) => this.optionClick(e.target));
        });
    }

    /** @param {jQuery} btn  */
    optionClick(btn) {
        const value = btn.getAttribute('data-value');

        const selected = this.elements.btns.find((el) => el.classList.contains('selected'));
        if (selected) selected.classList.remove('selected');

        btn.classList.add('selected');

        // raise event to hook into
        this.events.optionClicked.trigger(value);
    }

    /** simulate btn click for specified difficulty */
    selectDifficulty(difficulty) {
        const btn = this.elements.btns.find((el) => el.getAttribute('data-value') === difficulty);
        this.optionClick(btn);
    }
}
