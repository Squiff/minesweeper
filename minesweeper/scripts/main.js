import { Minesweeper } from "./modules/minesweeper.js";
import { NewGameForm } from "./modules/newgameform.js";
import { gameOptions } from "./modules/gameoptions.js";

const MS = new Minesweeper('.minesweeper', gameOptions.easy);

new NewGameForm(MS, gameOptions);

// window.MS = MS;
