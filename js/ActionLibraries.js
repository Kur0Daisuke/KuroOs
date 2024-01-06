class Action{
    static ForceStop = false;

    constructor(main) {
        this.Main = main;
    }
    Start() {
        if(Action.ForceStop) {
            Action.ForceStop = false;
            return;
        }
        this.Main(() => {
            this.Start()
        });
    }
}

const ActionLibrary = [
    {
        key: "/install",
        action: new Action((callback) => {
            Terminal.ShowMessage("Time to Do the installation <br>")
            setTimeout(() => {
                callback();
            }, 500)
        })
    },
    
]