import Os from "./node_modules/kuroos"

const terminalDiv = document.querySelector(".terminal");

const ActionLibrary = new Os.ACTION_LIBRARY();
console.log(ActionLibrary.Actions)
const terminal = new Os.Terminal(terminalDiv, ActionLibrary);
// const Os = new OS();
// Os.Load();
// colorMode | 0 - default | 1 - pastel mode | 2 - Custom Color
