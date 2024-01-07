class Terminal{
    static _terminalDiv;
    static _controlPressed = false;
    static _cpressed = false;
    static _ActionLibrary;
    static _CommandHistory = [{command:"", cursorPosition: 0}];
    static _CopyHistory = "";

    constructor(terminalDiv, ActionLibrary) {
        Terminal._ActionLibrary = ActionLibrary;
        Terminal._terminalDiv = terminalDiv;
        Terminal.ShowMessage("Kuro Os [Version 0.1]<br>All credits goes to the og operating systems <br><br>")
        Terminal.Input();

        document.title = "C:\\Users\\user\\cmd.exe";
    }
    static insertAtIndex(str, substring, index) {
        return str.slice(0, index) + substring + str.slice(index);
    }
    static ShowMessage(message) {
        Terminal._terminalDiv.innerHTML += message;
    }
    // __ ENTER KEY HANDLER ___
    static CheckCommand(command, cursorPosition, div) {
        let parameterI = command.length;
        for(let x = 0; x < command.length; x++) {
            if(command[x] == " ") {parameterI = x; break;}
        }
        for(let i = 0; i < Terminal._ActionLibrary.length; i++) {
            if(Terminal._ActionLibrary[i].parameterAllowed) {
                if(command.slice(0, parameterI) == Terminal._ActionLibrary[i].key) {
                    Terminal._ActionLibrary[i].action.Start(command.slice(parameterI+1,command.length), div);
                    return;
                }
            }else if(command.slice(0, parameterI) == Terminal._ActionLibrary[i].key && !Terminal._ActionLibrary[i].parameterAllowed){
                Terminal._ActionLibrary[i].action.Start("", div);
                break;
            }
        }
        Terminal._CommandHistory.push({command: command, cursorPosition: cursorPosition});
        Terminal.ShowMessage(`'${command.slice(0, parameterI)}' is not recognized as an internal or external command, operable program or batch file<br><br>`);
        Terminal.Input();
    }
    // __ STOP THE OPERATION
    static _StopAction() {
        Action.ForceStop = true;
        Action.IsOperating = false;
        Terminal.ShowMessage("Stopped Operation")
        Terminal.Input();
    }
    // KEY LISTENERS FOR CONTROL + C
    static _StopKeyUpListener(e) {
        switch(e.key){
            case "c":
                if(Terminal._controlPressed && Terminal._cpressed && Action.IsOperating) Terminal._StopAction();
                Terminal._cpressed = false;
                break;
            case "Control":
                Terminal._controlPressed = false;
                break;
        }
    }
    static _StopKeyDownListener(e) {
        switch(e.key){
            case "Control":
                Terminal._controlPressed = true;
                break;
            case "c":
                Terminal._cpressed = true;
                break;
        }
    }
    static IncreaseHeight() {
        Terminal._terminalDiv.style.height = `${Terminal._terminalDiv.style.height+150}%`
    }
    // ____ INPUT LINE ____
    static Input(params={autoCommand:``}) {
        //____ ADDING INPUT DIV _____
        let cmd = document.createElement("div");
        cmd.classList.add("cmd");
        cmd.innerHTML = `
            <span><:C/Users/user></span>&nbsp;<div class="input"></div></div>
        `
        let inputBox = cmd.querySelector(".input");
        Terminal._terminalDiv.appendChild(cmd);
        cmd.scrollIntoView(false);

        //____ SECONDARY VARIABLES ____
        let cursorPosition = 0;
        let command = params.autoCommand;
        let ToAppend = "";
        let currentHistory = Terminal._CommandHistory.length-1;
        let selecting = false;
        let selected = false;
        let selectedCharacters = [];
        let startPosition = 0;

        //___ HANDLERS ____
        const GetSelected = () => {
            let i = cursorPosition < startPosition ? cursorPosition : startPosition;
            let x = i == cursorPosition ? startPosition : cursorPosition;
            return [i,x]
        }
        const AddCursor = () => {
            ToAppend = Terminal.insertAtIndex(command, `<div class="cursor"></div>`, cursorPosition)
            inputBox.innerHTML = `${ToAppend}`;
        }
        const eraseText = () => {
            let [i,x] = GetSelected();
            if(cursorPosition-1 < 0 && !selected) return
            if(selected) {
                command = command.slice(0, i) + command.slice(x, command.length)
                // cursorPosition-=x;
            }else {
                command = command.slice(0, cursorPosition-1)+command.slice(cursorPosition, command.length)
                cursorPosition--;
            }
            selected = false;
            AddCursor()
        }
        const appendText = (textToUpdate) => {
            let [i,x] = GetSelected();
            if(selected) {
                command = command.slice(0, i) + textToUpdate + command.slice(x, command.length);
            }else {
                command = Terminal.insertAtIndex(command, textToUpdate, cursorPosition);
                cursorPosition++;
            }
            selected = false;
            AddCursor()
        }
        const updateCursor = (direction) => {
            if(cursorPosition + direction <= command.length && cursorPosition + direction >= 0) cursorPosition += direction;
            AddCursor()
        }
        const upateByHistory = () => {
            console.log(currentHistory)
            command = Terminal._CommandHistory[currentHistory].command;
            cursorPosition = Terminal._CommandHistory[currentHistory].cursorPosition;
            AddCursor();
            if(currentHistory-1<0) currentHistory = Terminal._CommandHistory.length-1;
            else currentHistory--;
        }
        const SelectedHandler = () => {
            let [i,x] = GetSelected();
            ToAppend = command.slice(0, i) + `<p class="selected">` + command.slice(i, x) + `</p>` + command.slice(x, command.length);
            // AddCursor();
            inputBox.innerHTML = ToAppend
        }

        const keydown = (e) => {
            let [i,x] = GetSelected();
            switch(e.key){
                case "ArrowLeft":
                    updateCursor(-1);
                    if(selected) selected = false;
                    if(selecting) SelectedHandler()
                    break;
                case "ArrowRight":
                    updateCursor(1);
                    if(selected) selected = false;
                    if(selecting) SelectedHandler()
                    break;
                case "Backspace":
                    eraseText();
                    break;
                case "ArrowUp":
                    upateByHistory();
                    break;
                case "Shift":
                    selecting = true;
                    startPosition = cursorPosition;
                    break;
                case "c":
                    if(Terminal._controlPressed) {
                        Terminal._CopyHistory = command.slice(i,x)
                    }else appendText(e.key);
                    break;
                case "x":
                    if(Terminal._controlPressed) {
                        Terminal._CopyHistory = command.slice(i,x)
                        command = command.slice(0, i) + command.slice(x, command.length)
                        AddCursor();
                    }else appendText(e.key);
                    break;
                case "v":
                    if(Terminal._controlPressed) {
                        command = Terminal.insertAtIndex(command, Terminal._CopyHistory, cursorPosition);
                        cursorPosition+=Terminal._CopyHistory.length;
                        AddCursor();
                    }else appendText(e.key);
                    console.log(Terminal._CopyHistory)
                    break;
                case "a":
                    if(Terminal._controlPressed) {
                        startPosition = 0;
                        cursorPosition = command.length;
                        selected = true;
                        ToAppend = `<p class="selected">` + command + `</p>`;
                        inputBox.innerHTML = ToAppend
                    }else appendText(e.key);
                    break;
                case " ":
                    appendText(`\u0020`);
                    break;
                //___ Ignore Characters __
                case "Enter":
                    break;
                case "ArrowDown":
                    break;
                case "Control":
                    break;
                // ___ ELSE WE DO THIS __
                default:
                    appendText(e.key);
            }
        }
        // __ Pressing Handler ___
        const keyup = (e) => {
            switch(e.key){
                case "Enter":
                    inputBox.innerHTML = command;
                    Terminal.CheckCommand(command, cursorPosition, inputBox)
                    window.removeEventListener("keydown", keydown)
                    window.removeEventListener("keyup", keyup)
                    break;
                case "Shift":
                    selecting = false;
                    selected = true;
                    break;
            }
        }

        //__ Assign auto command ___
        (() => {
            inputBox.innerHTML += params.autoCommand;
        })();
        AddCursor();

        //init the event listeners
        window.addEventListener("keydown", keydown);
        window.addEventListener("keyup", keyup)
        window.addEventListener("keydown", Terminal._StopKeyDownListener);
        window.addEventListener("keyup", Terminal._StopKeyUpListener);
    }
}