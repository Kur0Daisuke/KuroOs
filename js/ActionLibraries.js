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
    Start(parameter="", div) {
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
            parameter,
            div
        });
    }
}

const ActionLibrary = [
    {
        key: "echo",
        parameterAllowed: true,
        action: new Action((params) => {
            Terminal.ShowMessage(params.parameter)
            params.finish();
        })
    },
    {
        key: "/help",
        parameterAllowed: false,
        action: new Action((params) => {
            console.log(this)
            params.finish();
            // Terminal.ShowMessage(`Available Commands <br> ${() =>{for(let x= 0; x<this.length)}}`)
        })
    },
    {
        key: "date",
        parameterAllowed: false,
        action: new Action((params) => {
            Terminal.ShowMessage(new Date())
            params.finish();
        })
    },
    {
        key: "color",
        parameterAllowed: true,
        action: new Action((params) => {
            Terminal.IncreaseHeight()
            params.div.scrollIntoView(true)
            Terminal.ShowMessage(`
Sets the default console foreground and background colors.

COLOR [attr]
            
attr        Specifies color attribute of console output
            
Color attributes are specified by TWO hex digits -- the first
corresponds to the background; the second the foreground.  Each digit
can be any of the following values:
            
    0 = Black       8 = Gray
    1 = Blue        9 = Light Blue
    2 = Green       A = Light Green
    3 = Aqua        B = Light Aqua
    4 = Red         C = Light Red
    5 = Purple      D = Light Purple
    6 = Yellow      E = Light Yellow
    7 = White       F = Bright White
            
If no argument is given, this command restores the color to what it was
when CMD.EXE started.  This value either comes from the current console
window, the /T command line switch or from the DefaultColor registry
value.
            
The COLOR command sets ERRORLEVEL to 1 if an attempt is made to execute
the COLOR command with a foreground and background color that are the
same.
            
Example: "COLOR fc" produces light red on bright white
            `)
            // params.finish();
        })
    }
]