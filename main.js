import { Terminal } from "./Source/index.js"

const terminalDiv = document.querySelector(".Terminal");

const terminal = new Terminal(terminalDiv);

console.log(terminal)

// const Os = new OS();
// Os.Load();
// colorMode | 0 - default | 1 - pastel mode | 2 - Custom Color
