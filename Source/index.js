import TerminalClass from './Terminal/terminal.js'
import ActionLibraryClass from './Terminal/ActionLibrary.js'

class Terminal{
    constructor(terminalDiv) {
        this.terminalDiv = terminalDiv;
        this.terminalClass = new TerminalClass(this.terminalDiv);
    }
    Destroy() { 
        this.terminalClass.Destroy(this.terminalClass) 
    }
}

TerminalClass._ActionLibrary = new ActionLibraryClass().GetActions;

export { Terminal }