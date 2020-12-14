/** Class to manage Storage and retievel of scores */
export class ScoreManager {
    
    // fetch scores from localStorage
    static getScores(){
        let scores = localStorage.getItem('scores');
        
        if (scores) {
            return JSON.parse(scores);
        } else {
            return ScoreManager.default();
        }
    }

    // save scores to localStorage
    static setScores(scores){
        if (scores) {
            const scoresJson = JSON.stringify(scores);
            localStorage.setItem('scores', scoresJson);
        } else {
            localStorage.removeItem('scores');
        }
    }

    /** default object when no scores have been stored */ 
    static default(){
        return {
            easy: [],
            intermediate: [],
            hard: []
        }
    }
}