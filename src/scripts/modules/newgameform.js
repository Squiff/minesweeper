import { AppEvent } from "./appevent.js";
import { gameOptions } from "./gameoptions.js";

export class NewGameForm{
    constructor(){
        this.events = {
            newGame: new AppEvent() // args: {...options, difficulty}
        }

        this.bindEvents();
    }

    bindEvents(){
        $('#startGame').click(this.startGame.bind(this));
    }

    startGame(e){
        e.preventDefault();
        
        const difficulty = $('#difficulty').val();
        const options = gameOptions[difficulty];

        this.events.newGame.trigger(options);
    }
}