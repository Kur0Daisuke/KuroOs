class TerminalComponent extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        console.log("component is added", this)
    }

}

const style = `
    terminal-block {
    /* to change  */
    /* display: none; */
    
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-height: 100%;
    padding: 15px;
    overflow-y: scroll;
    color: var(--terminalColor);
    background: black;
}
terminal-block > span {
    color: var(--terminalColor);
    white-space: pre;
}
.cmd{
    display: flex;
    flex-direction: row;
}
.input{
    display: flex;
    color: var(--terminalColor);
    white-space: pre;
}
.cursor{
    width: 1px;
    height: 2px;
    margin-top: -15px;
}
.location {
    color: var(--locationColor);
}

.cursor::after{
    content: '';
    font-size: 30px;
    animation: cursor 1s infinite;
}
.selected{
    background: blue;
}
.cursor.stop::after{
    display: none;
}
.space{
    color: black;
}

@keyframes cursor{
    from {content:''}
    to {content: '❚'}
}

.appWindow{
    position: absolute;
    width: 50%;
    height: 100%;
}
`

export {TerminalComponent, style};