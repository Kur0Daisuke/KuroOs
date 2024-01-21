import TerminalClass from './Terminal/terminal.js'
import ActionLibraryClass from './Terminal/ActionLibrary.js'

class Terminal{
    static ActionLibrary = ActionLibraryClass;
    constructor(terminalDiv, ActionLibrary) {
        this.terminalDiv = terminalDiv;
        this.terminalClass = new TerminalClass(this.terminalDiv, ActionLibrary);
    }
    Destroy() {
        delete this.terminalClass;
        this.terminalDiv.remove();
    }
}

export { Terminal }