import { AppEvent } from "./appevent.js";

/** Group of difficulty options */
export class ScoreSelect {

    constructor(){
        this.elements = {
            btns: $('.score-option')
        }

        this.events = {
            optionClicked: new AppEvent() // args - data-value of clicked option
        }

        this.bindEvents();
    }

    bindEvents(){
        const btns = this.elements.btns;
        btns.click((e) => this.optionClick($(e.target)))
    }

    /** @param {jQuery} btn  */
    optionClick(btn){
        const value = btn.attr('data-value');
        const selected = this.elements.btns.filter('.selected');
        
        selected.removeClass('selected');
        btn.addClass('selected')

        // raise event to hook into
        this.events.optionClicked.trigger(value)
    }

    /** simulate btn click for specified difficulty */ 
    selectDifficulty(difficulty){
        const btn = this.elements.btns.filter(`[data-value=${difficulty}]`);
        this.optionClick(btn);
    }

}