import Action from "./Action.js";

const DEFAULT_ACTIONS = [
    (Terminal) => {
        return {
            key: "echo",
            action: new Action({main: (params) => {
                Terminal.ShowMessage(params.argument.join(" "))
                params.finish(Terminal);
            }}),
	    description: "\n\necho out the text you want! ($ variables doesn't work)\n"
        }
    },
    (Terminal) => {
        return {
            key: "/help",
            action: new Action({main: (params) => {
                Terminal.ShowMessage(`Available Commands <br> ${DEFAULT_ACTIONS.map(e => 
                    `  
    ${e().key} - ${e().description == undefined ? "" : e().description} <br>
                    `
                ).join("")}<br>`)
                params.finish(Terminal);
            }}),
            description: "\n\nthis command\n"
        }
    },
    (Terminal) => {
        return {
            key: "date",
            action: new Action({main: (params) => {
                Terminal.ShowMessage(new Date())
                params.finish(Terminal);
            }}),
	    description: "\n\nreturns the current date.\n"
        }   
    },
    (Terminal) => {
        return {
            key: "color",
            action: new Action({main: (params) => {
                // Terminal.IncreaseHeight()
                Terminal.ScrollToView();
                if(params.argument.includes("?")) {
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
                    if(params.argument[0].toString() == 0) {
                        Terminal.GetUserInput("Are you really sure that you could see in this pitch black color? (y/n)", 
                        (input) => {
                            if(input == "y") {
                                params.finish(Terminal);
                                document.querySelector(':root').style.setProperty('--terminalColor', TerminalColors[parseInt(params.argument[0])])
                            }else {
                                Terminal.ShowMessage(`I'll accept that "No". Wise choice you made Sir.`)
                                params.finish(Terminal);
                            }
                        });
                    }else {
                        params.finish(Terminal);
                        document.querySelector(':root').style.setProperty('--terminalColor', TerminalColors[parseInt(params.argument[0])])
                    }
                    
            }}),
	    description: "\n\nChange da color (beta)\n"
        }   
    },
    (Terminal) => {
        return {
            key: "/parrot",
            description: "creates an rgb parrot",
            action: new Action({main: (params) => {
                
                let currentFrame = params.parameterPassing == undefined ? 0 : params.parameterPassing;

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
                if(params.preloadedData == undefined) {
                    Terminal.ShowMessage("Loading")
                }else {
                    Terminal.ShowMessage(params.preloadedData[currentFrame]);
                }
                
                document.querySelector(':root').style.setProperty('--terminalColor', colorsOptions[Math.floor(Math.random() * colorsOptions.length-1)])
                setTimeout(() => params.callback(currentFrame), 50)

            }, 
            //____ Load Frames _____
	    preload: () => {
                return new Promise(async (res) => {
                    let frames = []
                    for (let i = 0; i < 10; i++) {
                        let frameresponse = await fetch(`../Source/Extras/frames/${i}.txt`)
                        let frame = await frameresponse.text()
                        frames.push(frame)
                    }
                    
                    res(frames)
                })
            },
            // ___ If Stopped Abruptly ____ 
	    stopCallback: () => {
                document.querySelector(':root').style.setProperty('--terminalColor', "white")
            }}),
	    description: "\n\nYEAHHHHH BABYYYYYYYYYYYYYYYYYYYY DANCING PARROT!"
        }   
    },
    (Terminal) => {
        return {
            key: "clear",
            action: new Action({main:(params) => {
                Terminal.ClearScreen();
                params.finish(Terminal)
            }}),
	    description: "\n\nClears this terminal for a fresh look.\n"
        }
    },
    (Terminal) => {
        return {
            key: "cowsay",
            action: new Action({main: (params) => {
                if(params.option.length > 1) {
                    params.finish(Terminal);
                    return
                }
                let variants = {
                    "-b": `
   \\   ^__^
    \\  (==)\\_______
       (__)\\       )\\/\\
            ||----w |
            ||     ||`,

                    "": `
   \\   ^__^
    \\  (oo)\\_______
       (__)\\       )\\/\\
            ||----w |
            ||     ||`,
                    "-d": `
   \\   ^__^
    \\  (xx)\\_______
       (__)\\       )\\/\\
        U   ||----w |
            ||     ||`,
                    "-p": `
   \\   ^__^
    \\  (@@)\\_______
       (__)\\       )\\/\\
            ||----w |
            ||     ||`,
                    "-s": `
   \\   ^__^
    \\  (**)\\_______
       (__)\\       )\\/\\
        U   ||----w |
            ||     ||`,
                    "-y": `
   \\   ^__^
    \\  (..)\\_______
       (__)\\       )\\/\\
            ||----w |
            ||     ||`,
                    "tux": `
   \\
    \\
            .--.
           |o_o |
           |:_/ |
          //   \\ \\
         (|     | )
        /'\\_   _/'\\
        \\___)=(___/
                    `,
                    "dragon": `
   \\                      / \\  //\\
    \\      |\\___/|      /   \\//  \\
           /0  0  \\__  /    //  | \\ \\
         /     /  \\/_/    //   |  \\  \\
        @_^_@'/   \\/_   //    |   \\   \\
         <b style='color:orange'>//</b>_^_/     \\/_ //     |    \\    \\
        <b style='color:orange'>( //)</b> |        \\///      |     \\     \\
      <b style='color:orange'>( / /)</b> _|_ /   )  //       |      \\     _\\
    <b style='color:orange'>( // /)</b> '/,_ _ _/  ( ; -.    |    _ _\\.-~    .-~~~^-.
  <b style='color:orange'>(( / / ))</b> '-{        _      '-.|.-~-.         .~        '.
 <b style='color:orange'>(( // / ))</b>  '/\\     /                 ~-. _ .-~   .-~^-.   \\
 <b style='color:orange'>(( /// ))</b>      '.   {            }                /      \\   \\
  <b style='color:orange'>(( / ))</b>     .----~-.\\       \\-'                .~         \\ '.\\^-.
             ///.----..>        \\             _ -~           '.  ^-'  ^-_
               ///-._ _ _ _ _ _ _}^ - - - - ~                   ~-- ,.-~
                                                                /.-~ 
                    `
                }

                let arg = "", found = false;
                for(let i = 0; i < params.argument.join(" ").length; i++) {
                    if(params.argument.join(" ")[i] == `"` && !found) {
                        found = true;
                        continue
                    }else if(found && params.argument.join(" ")[i] !== `"`) {
                        arg += params.argument.join(" ")[i];
                    }if(found && params.argument.join(" ")[i] == `"`) break;
                }
                let textDiv, text=arg.split(" "), textindex = 0;
		
		if(arg == ""){
		    Terminal.ShowMessage("cow out.");
		    params.finish(Terminal);
		    return;
		}

                for(let i = 0; i < arg.length+4; i++) Terminal.ShowMessage("_");
                Terminal.ShowMessage("\n");
                textDiv = Terminal.ShowMessage("< ");
                Terminal.ShowMessage("\n");
                for(let i = 0; i < arg.length+4; i++) Terminal.ShowMessage("-");

                const utterance = new SpeechSynthesisUtterance(arg);

                // Select a voice
                const voices = speechSynthesis.getVoices();
                utterance.voice = voices[0];
                speechSynthesis.pitch = 1;

                utterance.onboundary = () => {
                    if(text[textindex] == undefined) {
                        textDiv.innerHTML += ">";
                        params.finish(Terminal);
                        return;
                    }
                    textDiv.innerHTML += text[textindex] + " ";
                    textindex++;
                }

		console.log(params.argument.join(" "))

                if(params.option.join(" ") == "-f" && params.argument.join(" ").includes("tux")) {
                    Terminal.ShowMessage(`
                ${variants["tux"]}
                `)
                }else if(params.option.join(" ") == "-f" && params.argument.join(" ").includes("dragon")) {
                    speechSynthesis.pitch = 2;
                    Terminal.ShowMessage(`
                ${variants["dragon"]}
                `)
                }else {
                    Terminal.ShowMessage(`
                ${variants[params.option.join(" ")]}
                `)
                }
                
                speechSynthesis.speak(utterance);
            }}),
	    description: `\n\nCowsay command type ~ cowsay "{your text here}" ~ to make a cow that speaks\nexperiement modifiers such as ~ -b, -d, -p, -s, -y ~ for extra appearence.\n by also typing ~ cowsay -f {tux or dragon} "Your text" ~ can make a huge difference.`
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
