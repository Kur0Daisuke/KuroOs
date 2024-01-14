/**
 */
class Terminal{
    static _terminalDiv;
    static _controlPressed = false;
    static _cpressed = false;
    static _ActionLibrary;
    static _CommandHistory = [{command:"", cursorPosition: 0}];
    static _CopyHistory = "";

    /**
     * 
     * @param {*} terminalDiv - points to the main div where the terminal is
     * @param {*} ActionLibrary - Action Library Class
     */
    constructor(terminalDiv, ActionLibrary) {
        Terminal._ActionLibrary = ActionLibrary.Actions;
        Terminal._terminalDiv = terminalDiv;
        Terminal.ShowMessage("Kuro Os [Version 0.1]<br>All credits goes to the og operating systems <br><br>")
        Terminal.Input();

        document.title = "C:\\Users\\user\\cmd.exe";
        window.addEventListener("keydown", Terminal._TerminalKeyUpListener);
        window.addEventListener("keyup", Terminal._TerminalKeyUpListener);
    }
    /**
     * 
     * @param {*} message 
     * @returns A new Promise
     * @description - Creates a input line and returns user input after pressing the Enter key (function must be async)
     * @example - //inside the action Function 
     * () => { 
     *     ...
     *     await Terminal.GetUserInput() 
     *     ... 
     * }
     */
    static GetUserInput(message) {
        return new Promise((res) => {
            Terminal.ShowMessage(message);
            let inputBox = document.createElement('div');
            inputBox.className = "input";

            Terminal._terminalDiv.appendChild(inputBox);
            Terminal.InputBoxHandler({inputBox, callback: (name) => {
                res(name);
            }});
        })
    }
    static insertAtIndex(str, substring, index) {
        return str.slice(0, index) + substring + str.slice(index);
    }
    /**
     * 
     * @param {*} message
     * @description - Emits an message to the terminal
     * @example  - //inside the action Function 
     * () => { 
     *     ...
     *     Terminal.ShowMessage(..message here..) 
     *     ... 
     * }
     */
    static ShowMessage(message) {
        Terminal._terminalDiv.innerHTML += message;
    }
    static ReturnError(command, cursorPosition, parameterI) {
        Terminal._CommandHistory.push({command: command, cursorPosition: cursorPosition});
        Terminal.ShowMessage(`'${command.slice(0, parameterI)}' is not recognized as an internal or external command,<br> operable program or batch file<br><br>`);
        Terminal.Input();
    }
    // __ ENTER KEY HANDLER ___
    static CheckCommand(command, cursorPosition, div, callback) {
        let parameterI = command.length;
        for(let x = 0; x < command.length; x++) {
            if(command[x] == " ") {parameterI = x; break;}
        }
        console.log(Terminal._ActionLibrary)
        for(let i = 0; i < Terminal._ActionLibrary.length; i++) {
            if(Terminal._ActionLibrary[i].parameterAllowed) {
                if(command.slice(0, parameterI) == Terminal._ActionLibrary[i].key) {
                    Terminal._ActionLibrary[i].action.Start(command.slice(parameterI+1,command.length), div);
                    return;
                }
            }else if(command.slice(0, parameterI) == Terminal._ActionLibrary[i].key && !Terminal._ActionLibrary[i].parameterAllowed){
                Terminal._ActionLibrary[i].action.Start("", div);
                return;
            }
        }
        callback(command, cursorPosition, parameterI);
    }
    // __ STOP THE OPERATION
    static _StopAction() {
        Action.ForceStop = true;
        Action.IsOperating = false;
        Terminal.ShowMessage("Stopped Operation")
        Terminal.Input();
    }
    // KEY LISTENERS FOR CONTROL + C
    static _TerminalKeyUpListener(e) {
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
    static _TerminalKeyUpListener(e) {
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
    static InputBoxHandler({inputBox, params={autoCommand:``, doNotScroll: false}, callback=this.ReturnError}) {
        //____ SECONDARY VARIABLES ____
        let cursorPosition = 0;
        let command = params.autoCommand;
        let ToAppend = "";
        let currentHistory = Terminal._CommandHistory.length-1;
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
                    Terminal.CheckCommand(command, cursorPosition, inputBox, callback)
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
    }
    // ____ INPUT LINE ____
    /**
     * 
     * @param {*} params - {autoCommand, doNotScroll}
     * @description new input line 
     * @example -  - //inside the action Function 
     * () => { 
     *     ...
     *     Terminal.Input(.. {"" // <-- autoCommand, false || true // <-- ToScrollOrNot(closed parameter) }) 
     *     ... 
     * }
     * //parameters are not necessary for normal useage
     */
    static Input(params={autoCommand:``, doNotScroll: false}) {
        //____ ADDING INPUT DIV _____
        let cmd = document.createElement("div");
        cmd.classList.add("cmd");
        cmd.innerHTML = `
            <span class="location"><:C/Users/user></span>&nbsp;<div class="input"></div></div>
        `
        Terminal._terminalDiv.appendChild(cmd);
        let inputBox = cmd.querySelector(".input");
        
        if(!params.doNotScroll) cmd.scrollIntoView(false);
        Terminal.InputBoxHandler({inputBox, params})
    }
}