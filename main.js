import Terminal from '/js/terminal.js'
import { ACTION_LIBRARY } from '/js/ActionLibrary.js'

const terminalDiv = document.querySelector(".terminal");

const ActionLibrary = new ACTION_LIBRARY();
console.log(ActionLibrary.Actions)
const terminal = new Terminal(terminalDiv, ActionLibrary);
// const Os = new OS();
// Os.Load();
// colorMode | 0 - default | 1 - pastel mode | 2 - Custom Color
