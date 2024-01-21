import { Terminal } from "./Source/index.js"
import Db from './Source/Database/main.js';

const terminalDiv = document.querySelector(".terminal");

const ActionLibrary = new Terminal.ActionLibrary();

const db = new Db()

// const terminal = new Terminal(terminalDiv, ActionLibrary);

setTimeout(() => {
    // terminal.Destroy()
}, 3000 )

// const Os = new OS();
// Os.Load();
// colorMode | 0 - default | 1 - pastel mode | 2 - Custom Color
