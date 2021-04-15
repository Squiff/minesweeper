import { ScoreManager } from './scoremanager.js';
import * as Utilities from './utilities.js';

/** Table of high scores */
export class Scores {
    constructor() {
        this.state = {
            scores: ScoreManager.getScores(),
            lastScore: null,
            recordLimit: 10,
        };

        this.elements = {
            table: document.querySelector('.score-tbl'),
            scoreMsg: document.getElementById('scoreMsg'),
        };
    }

    /** Display table for selected difficulty. If no scores display message */
    renderTable(difficulty) {
        const table = this.elements.table;
        const scoreMsg = this.elements.scoreMsg;
        const scores = this.state.scores;

        if (scores[difficulty].length === 0) {
            scoreMsg.style.removeProperty('display');
            table.style.setProperty('display', 'none');

            scoreMsg.innerText = `Could not find any scores. Complete a game on ${difficulty} to see your best times`;
        } else {
            scoreMsg.style.setProperty('display', 'none');
            table.style.removeProperty('display');
            this.renderTableRows(difficulty);
        }
    }

    /** Render High score table */
    renderTableRows(difficulty) {
        const tableContents = this.elements.table.querySelector('tbody');

        // tableContents.empty();

        const rows = this.state.scores[difficulty].map((score, index) => {
            const args = {
                score: score,
                index: index,
                lastScore: this.state.lastScore,
            };

            return this.getTableRow(args);
        });

        const rowsHtml = rows.join('');
        tableContents.innerHTML = rowsHtml;
    }

    /** get Row HTML */
    getTableRow(args) {
        const format = this.getTimeFormat(args.score.completedIn);
        const timeScore = Utilities.formatTime(args.score.completedIn, format);

        const rowClass = args.score === args.lastScore ? 'class="score-new"' : '';

        return `<tr ${rowClass}">
                <td>${args.index + 1}</td>
                <td>${args.score.date}</td>
                <td>${timeScore}</td>
            </tr>`;
    }

    /** Get time format to be used by Utility formatter */
    getTimeFormat(ms) {
        const hasHour = ms > 1000 * 60 * 60;
        const hasMin = ms > 1000 * 60;

        return hasHour ? 'H:mm:ss.fff' : hasMin ? 'm:ss.fff' : 's.fff';
    }

    /** checks whether thetime is a high score */
    isHighScore(difficulty, completedIn) {
        const scores = this.state.scores[difficulty];
        const limit = this.state.recordLimit;

        if (scores.length < limit) return true;

        // get last score
        const lastHighScore = scores[scores.length - 1];

        if (completedIn < lastHighScore.completedIn) return true;

        return false;
    }

    /** Add high score and save to storage */
    addHighScore(difficulty, completedIn) {
        if (this.isHighScore(difficulty, completedIn) === false) return;

        const date = new Date();
        const dateStr = Utilities.formatDate(date, 'yyyy-MM-dd');
        const scores = this.state.scores;
        const scoreArr = scores[difficulty];

        const newScore = { date: dateStr, completedIn: completedIn };
        const newScores = this.addSortedScore(scoreArr, newScore);

        scores[difficulty] = newScores;
        this.state.lastScore = newScore;

        // persist to localStorage
        ScoreManager.setScores(scores);
    }

    /** push new score into sorted array in the correct position */
    addSortedScore(scoreArr, newScore) {
        const scores = [...scoreArr];
        const limit = this.state.recordLimit;

        let currentIndex = 0;

        while (
            currentIndex < scores.length &&
            newScore.completedIn > scores[currentIndex].completedIn
        ) {
            currentIndex++;
        }

        scores.splice(currentIndex, 0, newScore);

        return scores.slice(0, limit);
    }
}
