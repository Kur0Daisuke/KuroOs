import Action from "./Action.js";
import Os from "../Os/Os.js";

const DEFAULT_ACTIONS = [
    (Terminal) => {
        return {
            key: "echo",
            parameterAllowed: true,
            action: new Action((params) => {
                Terminal.ShowMessage(params.parameter)
                params.finish(Terminal);
            })
        }
    },
    (Terminal) => {
        return {
            key: "/help",
            parameterAllowed: false,
            action: new Action((params) => {
                Terminal.ShowMessage(`Available Commands <br> ${DEFAULT_ACTIONS.map(e => 
                    `  
                    ${e.key}$ - 
                    ${e.description == undefined ? "" : e.description} <br>
                    `
                ).join("")}<br>`)
                params.finish(Terminal);
            }),
            description: "this command"
        }
    },
    (Terminal) => {
        return {
            key: "date",
            parameterAllowed: false,
            action: new Action((params) => {
                Terminal.ShowMessage(new Date())
                params.finish(Terminal);
            })
        }   
    },
    (Terminal) => {
        return {
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
                        params.finish(Terminal);
                        return;
                    }
                    if(params.parameter == 0) {
                        Terminal.GetUserInput("Are you really sure that you could see in this pitch black color? (y/n)", 
                        (input) => {
                            if(input == "y") {
                                params.finish(Terminal);
                                document.querySelector(':root').style.setProperty('--terminalColor', TerminalColors[parseInt(params.parameter)])
                            }else {
                                Terminal.ShowMessage(`I'll accept that "No". Wise choice you made Sir.`)
                                params.finish(Terminal);
                            }
                        });
                    }else {
                        params.finish(Terminal);
                        document.querySelector(':root').style.setProperty('--terminalColor', TerminalColors[parseInt(params.parameter)])
                    }
                    
            })
        }   
    },
    (Terminal) => {
        return {
            key: "/install",
            parameterAllowed: false,
            action: new Action((params) => {
                Terminal.GetUserInput("Type your name", (input) => {
                    Terminal.ShowMessage(input);
                    Terminal.ShowMessage("<br>Downloading Content - - - ");
                    setTimeout(() => {
                        Terminal.ShowMessage("done.")
                        setTimeout(() => {
                            let os = new Os();
                            params.finish(Terminal);
                            Terminal.Destroy()
                        }, 500)
                    }, 1000)
                    
                });
            })
        }   
    },
    (Terminal) => {
        return {
            key: "/parrot",
            parameterAllowed: false,
            action: new Action(async (params) => {
                let currentFrame = params.parameterForCallback == undefined ? 0 : params.parameterForCallback;

                const colorsOptions = [
                    'red',
                    'yellow',
                    'green',
                    'blue',
                    'magenta',
                    'cyan',
                    'white'
                ];

                currentFrame = currentFrame+1 > 9 ? 0 : currentFrame+1;
                Terminal.ClearScreen()
                switch(currentFrame) {
                    case 0: Terminal.ShowMessage(params.preloadedData[currentFrame]); break; 
                    case 1: Terminal.ShowMessage(params.preloadedData[currentFrame]); break;
                    case 2: Terminal.ShowMessage(params.preloadedData[currentFrame]); break;
                    case 3: Terminal.ShowMessage(params.preloadedData[currentFrame]); break;
                    case 4: Terminal.ShowMessage(params.preloadedData[currentFrame]); break;
                    case 5: Terminal.ShowMessage(params.preloadedData[currentFrame]); break;
                    case 6: Terminal.ShowMessage(params.preloadedData[currentFrame]); break;
                    case 7: Terminal.ShowMessage(params.preloadedData[currentFrame]); break;
                    case 8: Terminal.ShowMessage(params.preloadedData[currentFrame]); break;
                    case 9: Terminal.ShowMessage(params.preloadedData[currentFrame]); break;
                }
                document.querySelector(':root').style.setProperty('--terminalColor', colorsOptions[Math.floor(Math.random() * colorsOptions.length-1)])
                setTimeout(() => params.callback(currentFrame), 50)

            }, () => {
                return new Promise(async (res) => {
                    var frame1response = await fetch('../Source/Extras/frames/0.txt')
                    var frame1 = await frame1response.text()

                    var frame2response = await fetch('../Source/Extras/frames/1.txt')
                    var frame2 = await frame2response.text()

                    var frame3response = await fetch('../Source/Extras/frames/2.txt')
                    var frame3 = await frame3response.text()
                    
                    var frame4response = await fetch('../Source/Extras/frames/3.txt')
                    var frame4 = await frame4response.text()

                    var frame5response = await fetch('../Source/Extras/frames/4.txt')
                    var frame5 = await frame5response.text()

                    var frame6response = await fetch('../Source/Extras/frames/5.txt')
                    var frame6 = await frame6response.text()

                    var frame7response = await fetch('../Source/Extras/frames/6.txt')
                    var frame7 = await frame7response.text()

                    var frame8response = await fetch('../Source/Extras/frames/7.txt')
                    var frame8 = await frame8response.text()

                    var frame9response = await fetch('../Source/Extras/frames/8.txt')
                    var frame9 = await frame9response.text()

                    var frame0response = await fetch('../Source/Extras/frames/9.txt')
                    var frame0 = await frame0response.text()
                    res([frame1, frame2, frame3, frame4, frame5, frame6, frame7, frame8, frame9, frame0])
                })
            },() => {
                console.log("here")
                document.querySelector(':root').style.setProperty('--terminalColor', "white")
            })
        }   
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