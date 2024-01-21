import Action from "./Action.js";
import Terminal from "./terminal.js";

const DEFAULT_ACTIONS = [
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
                    <br><br>
                    COLOR [attr]
                    <br><br>            
                    attr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Specifies color attribute of console output
                    <br><br>            
                    Color attributes are specified by TWO hex digits -- the first<br> 
                    corresponds to the background; the second the foreground.  Each digit<br> 
                    can be any of the following values:<br><br> 
                                
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 = Black&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6 = Yellow  <br>     
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 = Blue&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 = White <br> 
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 = Green&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8 = Gray <br> 
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3 = Aqua&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9 = Light Blue <br> 
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 = Red&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10 = Light Green <br> 
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5 = Purple     
                    <br><br> 
                    If no argument is given, this command restores the color to what it was
                    when CMD.EXE started.  This value either comes from the current console
                    window, the /T command line switch or from the DefaultColor registry
                    value.
                    <br><br>      
                    The COLOR command sets ERRORLEVEL to 1 if an attempt is made to execute
                    the COLOR command with a foreground and background color that are the
                    same.
                    <br><br>       
                    Example: "COLOR 25" produces purple on bright white
                `)
                    params.finish();
                    return;
                }
                if(params.parameter == 0) {
                    Terminal.GetUserInput("Are you really sure that you could see in this pitch black color? (y/n)", 
                    (input) => {
                        if(input == "y") {
                            params.finish();
                            document.querySelector(':root').style.setProperty('--terminalColor', TerminalColors[parseInt(params.parameter)])
                        }else {
                            Terminal.ShowMessage(`I'll accept that "No". Wise choice you made Sir.`)
                            params.finish();
                        }
                    });
                }else {
                    params.finish();
                    document.querySelector(':root').style.setProperty('--terminalColor', TerminalColors[parseInt(params.parameter)])
                }
                
        })
    },
    {
        key: "/install",
        parameterAllowed: false,
        action: new Action((params) => {
            Terminal.GetUserInput("Type your name", (input) => {
                Terminal.ShowMessage(input)
                params.finish();
            });
        })
    }
]

const animals = [
    "Aardvark",
    "Albatross",
    "Alligator",
    "Alpaca",
    "Ant",
    "Anteater",
    "Antelope",
    "Ape",
    "Armadillo",
    "Donkey",
    "Baboon",
    "Badger",
    "Barracuda",
    "Bat",
    "Bear",
    "Beaver",
    "Bee",
    "Bison",
    "Boar",
    "Buffalo",
    "Butterfly",
    "Camel",
    "Capybara",
    "Caribou",
    "Cassowary",
    "Cat",
    "Caterpillar",
    "Cattle",
    "Chamois",
    "Cheetah",
    "Chicken",
    "Chimpanzee"
]

const TerminalColors = [
    "black",
    "blue",
    "green",
    "aqua",
    "red",
    "purple",
    "yellow",
    "white",
    "gray",
    "lightblue",
    "lightgreen",
    "lightaqua",
    "lightred",
    "lightpurple",
    "lightyellow",
    "brightwhite"
]

export { TerminalColors, DEFAULT_ACTIONS }