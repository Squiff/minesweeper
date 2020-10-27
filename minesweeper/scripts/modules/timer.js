
/** simple timer that runs the callback function at a set interval */
export class Timer{
    
    /**
     * @param {number} ms - how often to run the callback function in milliseconds
     * @param {timerCallback} callback - the callback function
     */
    constructor(ms, callback){
        this.ms = ms;
        this.callback = callback;
        this.startDate = null;
        this.interval = null;
    }
  
    start(){
        this.startDate = new Date();
        this.interval = setInterval(this.runCallback.bind(this), this.ms);
    }

    stop(){
        clearInterval(this.interval);
    }

    runCallback(){
        const now = new Date();
        const timeElapsed = now - this.startDate;

        this.callback(timeElapsed);
    }

}


/**
 * Callback for adding two numbers.
 * @callback timerCallback
 * @param {number} ms - milliseconds since the timer started.
 */

 
