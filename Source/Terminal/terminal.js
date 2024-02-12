import Action from "./Action.js";

class Terminal{
    static _ActionLibrary;
    #terminalDiv;
    #CommandHistory;
    #CopyHistory;
    
    constructor(terminalDiv) {
        this.#terminalDiv = terminalDiv;
        this.controlPressed = false;
        this.cpressed = false;
        this.#CommandHistory = [{command:"", cursorPosition: 0}];
        this.#CopyHistory = "";

        this.ShowMessage(`/Kuro Os [Version 0.1]<br>All credits goes to the og operating systems <br><br>`)
        this.Input();

        document.title = "C:\\Users\\user\\cmd.exe";
        window.addEventListener("keydown", (e) => {
            switch(e.key){
                case "Control":
                    this.controlPressed = true;
                    break;
                case "c":
                    this.cpressed = true;
                    if(this.controlPressed && this.cpressed && Action.IsOperating) {
                        this._StopAction();
                        console.log("stop")
                    }
                    break;
            }
        });
        window.addEventListener("keyup", (e) => {
            switch(e.key){
                case "c":
                    this.cpressed = false;
                    break;
                case "Control":
                    this.controlPressed = false;
                    break;
            }
        });
    }
    Destroy() {
        let DestroyEvent = new CustomEvent("OnDestroy", {detail: this});
        window.dispatchEvent(DestroyEvent)
    }
    
    GetUserInput(message, callback= () => {}) {
        this.ShowMessage(message);
        let inputBox = document.createElement('div');
        inputBox.className = "input";

        this.#terminalDiv.appendChild(inputBox);
        this.InputBoxHandler({inputBox, callback});
    }
    static insertAtIndex(str, substring, index) {
        return str.slice(0, index) + substring + str.slice(index);
    }

    ShowMessage(message) {
        let div = document.createElement("span")
        div.innerHTML += message;
        this.#terminalDiv.appendChild(div);
        return div;
    }
    ScrollToView() {
        this.#terminalDiv.scrollIntoView(true)
    }
    ReturnError(command, cursorPosition, parameterI, terminal) {
        terminal.ShowMessage(`'${command.slice(0, parameterI)}' is not recognized as an internal or external command,<br> operable program or batch file<br><br>`);
        terminal.Input();
    }
    // __ ENTER KEY HANDLER ___
    CheckCommand(command, cursorPosition, div, callback) {
        let cmd = "", options = [], args = [];

        //Extract cmd, options, and arguments
        for(let i = 0; i < command.length; i++) {
            if(cmd != "" && command[i] == " " && command[i+1] !== "-") {
                let arg = "";
                for(let x = i+1; x < command.length; x++) {
                    if(command[x] !== " ") arg += command[x];
                    else break;
                }
                args.push(arg)
            }else if(cmd != "" && command[i] == "-") {
                let option = "";
                for(let x = i; x < command.length; x++) {
                    if(command[x] !== " ") option += command[x];
                    else break;
                }
                i+=option.length-1;
                options.push(option)
            }else if(cmd == "" && command[i] == " ") {
                cmd = command.slice(0,i);
                i -= 1;
            }else if(cmd == "" && i == command.length-1) {
                cmd = command.slice(0,i+1);
            }
        }
        this.#CommandHistory.push({command: command, cursorPosition: cursorPosition});
        // run the command
        for(let i = 0; i < Terminal._ActionLibrary.length; i++) {
            let action = Terminal._ActionLibrary[i](this);
            if(cmd == action.key){
                action.action.Start({option: options, argument: args});
                return;
            }else if(command.replace(/\s/g, "") == "") {;
                this.Input();
                return;
            }
        }

        this.#CommandHistory.push({command: command, cursorPosition: cursorPosition});
        callback(command, cursorPosition, /*parameterI*/command.length, this);
    }
    // __ STOP THE OPERATION
    _StopAction() {
        Action.ForceStop = true;
        Action.IsOperating = false;
        this.ShowMessage("Stopped Operation")
        this.Input();
    }
    IncreaseHeight() {
        this.#terminalDiv.style.height = `${Terminal._terminalDiv.style.height+150}%`
    }
    InputBoxHandler({inputBox, params={autoCommand:``, doNotScroll: false}, callback=this.ReturnError}) {
        //____ SECONDARY VARIABLES ____
        let cursorPosition = 0;
        let command = params.autoCommand;
        let ToAppend = "";
        let currentHistory = this.#CommandHistory.length-1;
        let selecting = false;
        let selected = false;
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
            }
            cursorPosition++;
            selected = false;
            AddCursor()
        }
        const updateCursor = (direction) => {
            if(cursorPosition + direction <= command.length && cursorPosition + direction >= 0) cursorPosition += direction;
            AddCursor()
        }
        const upateByHistory = () => {
            command = this.#CommandHistory[currentHistory].command;
            cursorPosition = this.#CommandHistory[currentHistory].cursorPosition;
            AddCursor();
            if(currentHistory-1<0) currentHistory = this.#CommandHistory.length-1;
            else currentHistory--;
        }
        const SelectedHandler = () => {
            let [i,x] = GetSelected();
            ToAppend = command.slice(0, i) + `<p class="selected">` + command.slice(i, x) + `</p>` + command.slice(x, command.length);
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
                    break;
                case "c":
                    if(this.controlPressed) {
                        this.#CopyHistory = command.slice(i,x)
                    }else appendText(e.key);
                    break;
                case "x":
                    if(this.controlPressed) {
                        this.#CopyHistory = command.slice(i,x)
                        command = command.slice(0, i) + command.slice(x, command.length)
                        cursorPosition = i;
                        AddCursor();
                    }else appendText(e.key);
                    break;
                case "v":
                    if(this.controlPressed) {
                        command = Terminal.insertAtIndex(command, this.#CopyHistory, cursorPosition);
                        cursorPosition+=this.#CopyHistory.length;
                        AddCursor();
                    }else appendText(e.key);
                    break;
                case "a":
                    if(this.controlPressed) {
                        startPosition = 0;
                        cursorPosition = command.length;
                        selected = true;
                        ToAppend = `<p class="selected">` + command + `</p>`;
                        inputBox.innerHTML = ToAppend
                    }else appendText(e.key);
                    break;
                //___ Ignore Characters __
                case "AudioVolumeUp":
                    break;
		case "AudioVolumeDown":
                    break;
		case "AudioVolumeMute":
                    break;
		case "Alt":
                    break;
		case "Tab":
                    break;
		case "End":
                    break;    
		case "Home":
                    break;
		case "PageUp":
                    break;
		case "PageDown":
                    break;
		case "CapsLock":
                    break;
		case "Enter":
                    break;
                case "ArrowDown":
                    break;
                case "Control":
                    break;
                // ___ ELSE WE DO THIS __
                default:
                    appendText(e.key);
                    startPosition = cursorPosition;
            }
        }
        // __ Pressing Handler ___
        const keyup = (e) => {
            switch(e.key){
                case "Enter":
                    inputBox.innerHTML = command;
                    this.CheckCommand(command, cursorPosition, inputBox, callback)
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
        window.addEventListener("keyup", keyup);
        window.addEventListener("OnDestroy", (e) => {
            console.log(e.detail)
            if(e.detail !== this) return;
            window.removeEventListener("keydown", keydown)
            window.removeEventListener("keyup", keyup)
        
            window.removeEventListener("keydown", this._TerminalKeyDownListener)
            window.removeEventListener("keyup", this._TerminalKeyUpListener)
        
            this.#terminalDiv.remove();
            delete this;
        })
    }
    
    Input(params={autoCommand:``, doNotScroll: false}) {
        //____ ADDING INPUT DIV _____
        let cmd = document.createElement("div");
        cmd.classList.add("cmd");
        cmd.innerHTML = `
            <span class="location">MainTerminal:-$</span>&nbsp;<div class="input"></div></div>
        `
        this.#terminalDiv.appendChild(cmd);
        let inputBox = cmd.querySelector(".input");
        
        if(!params.doNotScroll) cmd.scrollIntoView(false);
        this.InputBoxHandler({inputBox, params})
    }
    ClearScreen() {
        this.#terminalDiv.innerHTML = ""
    }

}

export default Terminal;
