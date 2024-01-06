class Action{
    static IsOperating = false;
    static ForceStop = false;

    constructor(main) {
        this.Main = main;
    }
    Done() {
        Action.IsOperating = false;
        Terminal.Input();
    }
    Start(parameter="") {
        Action.IsOperating = true;
        if(Action.ForceStop) {
            Action.ForceStop = false;
            return;
        }
        console.log(parameter)
        this.Main({
            callback: () => {
                this.Start()
            },
            finish: () => {
                this.Done();
            }, 
            parameter
        });
    }
}

const ActionLibrary = [
    {
        key: "echo",
        parameterAllowed: true,
        action: new Action(({callback, finish, parameter}) => {
            Terminal.ShowMessage(parameter)
            finish();
        })
    },
    {
        key: "/help",
        parameterAllowed: false,
        action: new Action(({callback, finish, parameter}) => {
            console.log(this)
            finish();
            // Terminal.ShowMessage(`Available Commands <br> ${() =>{for(let x= 0; x<this.length)}}`)
        })
    }
]