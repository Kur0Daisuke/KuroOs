import Terminal from "./terminal.js";

/**
 * @class
 * @description Action of what a command will do
 * @param main - Callback Function
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