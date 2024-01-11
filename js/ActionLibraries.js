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

class ACTION_LIBRARY {
    Actions = [];

    UpdateLibrary(update) {
        this.Actions = update;
    }
    get Actions(){
        return this.Actions
    }
}
const ActionLibrary = new ACTION_LIBRARY();
ActionLibrary.UpdateLibrary([
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
            Terminal.ShowMessage(`Available Commands <br> ${ActionLibrary.Actions.map(e => `  ${e.key} - ${e.description == undefined ? "" : e.description} <br>`).join("")}<br>`)
            params.finish();
        }),
        description: "this command"
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
            // Terminal.IncreaseHeight()
            params.div.scrollIntoView(true)
            if(params.parameter == "?") {
                Terminal.ShowMessage(`
Sets the default console foreground and background colors.

COLOR [attr]
            
attr        Specifies color attribute of console output
            
Color attributes are specified by TWO hex digits -- the first
corresponds to the background; the second the foreground.  Each digit
can be any of the following values:
            
    0 = Black       6 = Yellow      
    1 = Blue        7 = White
    2 = Green       8 = Gray
    3 = Aqua        9 = Light Blue
    4 = Red         10 = Light Green
    5 = Purple     
            
If no argument is given, this command restores the color to what it was
when CMD.EXE started.  This value either comes from the current console
window, the /T command line switch or from the DefaultColor registry
value.
            
The COLOR command sets ERRORLEVEL to 1 if an attempt is made to execute
the COLOR command with a foreground and background color that are the
same.
            
Example: "COLOR 25" produces purple on bright white
                `)
                    params.finish();
                    return;
                }
                params.finish();
                document.querySelector(':root').style.setProperty('--terminalColor', TerminalColors[parseInt(params.parameter)])
        })
    },
    {
        key: "/install",
        parameterAllowed: false,
        action: new Action(async (params) => {
            let input = await Terminal.GetUserInput("Type your name");
            Terminal.ShowMessage(input)
            params.finish();
        })
    }
])