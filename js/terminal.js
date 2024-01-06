class Terminal{
    static _terminalDiv;
    static _controlPressed = false;
    static _cpressed = false;
    static _ActionLibrary;
    static _CommandHistory = [{command:"", cursorPosition: 0}];

    constructor(terminalDiv, ActionLibrary) {
        Terminal._ActionLibrary = ActionLibrary;
        Terminal._terminalDiv = terminalDiv;
        Terminal.Input();
    }
    static insertAtIndex(str, substring, index) {
        return str.slice(0, index) + substring + str.slice(index);
    }
    static ShowMessage(message) {
        Terminal._terminalDiv.innerHTML += message;
    }
    // __ ENTER KEY HANDLER ___
    static CheckCommand(command, cursorPosition) {
        for(let i = 0; i < Terminal._ActionLibrary.length; i++) {
            if(command == Terminal._ActionLibrary[i].key){
                Terminal._ActionLibrary[i].action.Start();
                return
            }
        }
        Terminal._CommandHistory.push({command: command, cursorPosition: cursorPosition});
        Terminal.ShowMessage("Error: Not A Command");
        Terminal.Input();
    }
    // __ STOP THE OPERATION
    static _StopAction() {
        Action.ForceStop = true;
        Terminal.ShowMessage("Stopped Operation")
        Terminal.Input();
    }
    // KEY LISTENERS FOR CONTROL + C
    static _StopKeyUpListener(e) {
        switch(e.key){
            case "Control":
                if(Terminal._controlPressed && Terminal._cpressed) Terminal._StopAction();
                Terminal._controlPressed = false;
                break;
            case "c":
                if(Terminal._controlPressed && Terminal._cpressed) Terminal._StopAction();
                Terminal._cpressed = false;
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
    // ____ INPUT LINE ____
    static Input(autoCommand="/install") {
        //____ ADDING INPUT DIV _____
        let cmd = document.createElement("div");
        cmd.classList.add("cmd");
        cmd.innerHTML = `
            <span><:C/Users/user></span>&nbsp;<div class="input"></div></div>
        `
        let inputBox = cmd.querySelector(".input");
        Terminal._terminalDiv.appendChild(cmd);

        //____ SECONDARY VARIABLES ____
        let cursorPosition = 0;
        let command = autoCommand;
        let ToAppend = "";
        let currentHistory = Terminal._CommandHistory.length-1;

        //___ HANDLERS ____
        const AddCursor = () => {
            ToAppend = Terminal.insertAtIndex(command, `<div class="cursor"></div>`, cursorPosition)
            inputBox.innerHTML = ToAppend;
        }
        const eraseText = () => {
            if(cursorPosition-1 < 0) return
            command = command.slice(0, cursorPosition-1)+command.slice(cursorPosition, command.length)
            cursorPosition--;
            AddCursor()
        }
        const appendText = (textToUpdate) => {
            command = Terminal.insertAtIndex(command, textToUpdate, cursorPosition);
            cursorPosition++;
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

        const keydown = (e) => {
            switch(e.key){
                case "ArrowLeft":
                    updateCursor(-1);
                    break;
                case "ArrowRight":
                    updateCursor(1);
                    break;
                case "Backspace":
                    eraseText();
                    break;
                case "ArrowUp":
                    upateByHistory();
                    break;
                //___ Ignore Characters __
                case "Enter":
                    break;
                case "ArrowDown":
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
                    Terminal.CheckCommand(command, cursorPosition)
                    window.removeEventListener("keydown", keydown)
                    window.removeEventListener("keyup", keyup)
                    break;
            }
        }

        //__ Assign auto command ___
        (() => {
            inputBox.innerHTML += autoCommand;
        })();
        AddCursor();

        //init the event listeners
        window.addEventListener("keydown", keydown);
        window.addEventListener("keyup", keyup)
        window.addEventListener("keydown", Terminal._StopKeyDownListener);
        window.addEventListener("keyup", Terminal._StopKeyUpListener);
    }
}