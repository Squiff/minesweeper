import { Minesweeper } from "./modules/minesweeper.js";
import { NewGameForm } from "./modules/newgameform.js";
import { gameOptions } from "./modules/gameoptions.js";
import { Scores } from "./modules/scores.js"
import { ScoreSelect } from "./modules/scoreselect.js";

const SS = new ScoreSelect();
const S = new Scores();
const MS = new Minesweeper('.minesweeper', gameOptions.easy, S);

SS.events.optionClicked.addEventListener((difficulty) => S.renderTable(difficulty));
MS.events.gameWon.addEventListener((time) => addHighScore('easy', time));

function addHighScore(difficulty, time){
    S.addHighScore(difficulty, time);
    SS.selectDifficulty(difficulty);
}

SS.selectDifficulty('easy')

new NewGameForm(MS, gameOptions);

window.S = new Scores();