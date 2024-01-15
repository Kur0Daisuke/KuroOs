import Terminal from "./terminal.js";

/**
 * @class
 * @description Action after the command is entered
 * @param {function} main - Callback Function
 * @param {Object} params - parameters such as finish() and parameter
 * @param {function} params.callback - callback function to recall the operation
 * @param {function} params.finish - finish the operation
 * @param {string} params.parameter - command parameter
 * @param {HTMLElement} params.div - beta test (idek what this does)
 * 
 * @example - Check the Action Format first
 * action: new Action((params) => {
 *      ... // do some magic here
 * })
*/
class Action{
    static IsOperating = false;
    static ForceStop = false;

    constructor(main) {
        this.Main = main;
    }
    Done(doNotScroll) {
        Action.IsOperating = false;
        Terminal.Input({autoCommand: "", doNotScroll});
    }
    Start(parameter="", div) {
        Action.IsOperating = true;
        if(Action.ForceStop) {
            Action.ForceStop = false;
            return;
        }
        this.Main({
            callback: () => {
                this.Start()
            },
            finish: (doNotScroll=false) => {
                this.Done(doNotScroll);
            }, 
            parameter,
            div
        });
    }
}

export default Action;