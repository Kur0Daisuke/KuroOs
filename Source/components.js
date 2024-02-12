import {TerminalComponent, style} from './Components/TerminalComponent.js'

// ____ LOAD CUSTOM ELEMENTS _____
customElements.define("terminal-block", TerminalComponent)

// ____ STYLES ____
let Style = document.createElement("style")
Style.innerHTML += style;
document.head.appendChild(Style)