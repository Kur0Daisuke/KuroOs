class Terminal{
    constructor(terminalDiv) {
        this.terminalDiv = terminalDiv;
        this.Input();
    }
    insertAtIndex(str, substring, index) {
        return str.slice(0, index) + substring + str.slice(index);
    }
    Input(autoCommand="") {
        //____ ADDING INPUT DIV _____
        let cmd = document.createElement("div");
        cmd.classList.add("cmd");
        cmd.innerHTML = `
            <span><:C/Users/user></span>&nbsp;<div class="input"></div></div>
        `
        let inputBox = cmd.querySelector(".input");
        this.terminalDiv.appendChild(cmd);

        //____ SECONDARY VARIABLES ____
        let cursorPosition = 0;
        let text = "";
        let ToAppend = "";

        //___ HANDLERS ____
        const eraseText = () => {
            if(cursorPosition-1 >= 0) cursorPosition--;
            text = text.substr(0, cursorPosition-1) + text.substr(cursorPosition);
            console.log(cursorPosition)
            ToAppend = this.insertAtIndex(text, `<div class="cursor"></div>`, cursorPosition)
            inputBox.innerHTML = ToAppend;
        }
        const appendText = (textToUpdate) => {
            text = this.insertAtIndex(text, textToUpdate, cursorPosition);
            cursorPosition++;
            ToAppend = this.insertAtIndex(text, `<div class="cursor"></div>`, cursorPosition)
            inputBox.innerHTML = ToAppend
        }
        const updateCursor = (direction) => {
            if(cursorPosition + direction <= text.length && cursorPosition + direction >= 0) cursorPosition += direction;

            ToAppend = this.insertAtIndex(text, `<div class="cursor"></div>`, cursorPosition)
            inputBox.innerHTML = ToAppend
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
                default:
                    appendText(e.key);
            }
        }

        //init the event listeners
        window.addEventListener("keydown", keydown);
        // window.addEventListener("keyup")
    }
}