import Terminal from "./terminal.js";
/**
 * @class
 * @classdesc Action after the command is entered
 * @param {function} main - Callback Function
 * 
 * @param {Object} params - parameters such as finish() and parameter
 * @param {function} params.callback - callback function to recall the operation
 * @param {function} params.finish - finish the operation
 * @param {string} params.parameter - command parameter
 * @param {HTMLElement} params.div - beta test (idek what this does)
 * @see ActionFormat
 * @example
 * action: new Action((params) => {
 *      ... // do some magic here
 * })
*/
class Action{
    static IsOperating = false;
    static ForceStop = false;

    constructor(main, preload=() => {}, stopCallback=() => {}) {
        this.Main = main;
        this.preload = preload;
        this.stopCallback = stopCallback;
        this.preloadedData = []
        this.#init();
    }
    async #init() {
        this.preloadedData = await this.preload();
    }
    Done(Terminal) {
        Action.IsOperating = false;
        Terminal.Input({autoCommand: "", doNotScroll: false});
    }
    Start(parameter="", div, parameterForCallback=undefined) {
        Action.IsOperating = true;
        if(Action.ForceStop) {
            Action.ForceStop = false;
            this.stopCallback()
            return;
        }
        this.Main({
            callback: (parameterForCallback) => {
                this.Start("", null, parameterForCallback)
            },
            finish: (terminal) => {
                this.Done(terminal);
            }, 
            parameter,
            div,
            parameterForCallback,
            preloadedData: this.preloadedData
        });
    }
}

export default Action;