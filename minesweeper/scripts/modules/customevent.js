/** CustomEvent Class to enable raising/listening to custom events */
export class CustomEvent{

    constructor(){
        this.listeners = [];
    }

    /** Run all event listeners passing the provided args object */
    trigger(args){
        this.listeners.forEach(listener => {
            listener(args);
        })
    }

    addEventListener(listener){
        this.listeners.push(listener)
    }

    removeEventListener(listener){
        const index = this.listeners.indexOf(listener);

        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }
}