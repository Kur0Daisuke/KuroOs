class Terminal{
    constructor(terminalDiv){
        this.terminalDiv = terminalDiv;
        this.segmentSize = 2;
        this.terminalHistory = [{text:"", cursorPosition: 0}];
        this.InstallOS();
        this.stopAllOperation = false;
    }
    insertAtIndex(str, substring, index) {
        return str.slice(0, index) + substring + str.slice(index);
    }
      
    CommandLine(){
        let commandLine = document.createElement("div");
        commandLine.classList.add("cmd");
        commandLine.innerHTML = `
            <:C/users/YOU>&nbsp;<div class="input"></div>
        `
        this.terminalDiv.appendChild(commandLine);
        this.ScrollToBottom();
        let input = commandLine.querySelector(".input");
        var cursorPosition = 0;
        let historyIndex = this.terminalHistory.length-1;
        let prevText = "";
        let controlOn = [];

        let updateText = () => {
            let text = this.insertAtIndex(`${prevText}`, `<div class="cursor"></div>`, cursorPosition);
            input.innerHTML = text;
        }

        let keydown = (e) => {
            if(e.key == " ") input.innerHTML += "&nbsp;";
            else if(e.key == "Backspace") {
                prevText = prevText.slice(0, -1) 
                cursorPosition--;
                updateText();
            }else if(e.key == "ArrowUp") {
                prevText = this.terminalHistory[historyIndex].text;
                cursorPosition = this.terminalHistory[historyIndex].cursorPosition;
                if(historyIndex-1 < 0) historyIndex = this.terminalHistory.length-1;
                else historyIndex--;
                
                updateText();
            }else if(e.key == "ArrowDown") {
                prevText = this.terminalHistory[historyIndex].text;
                cursorPosition = this.terminalHistory[historyIndex].cursorPosition;
                if(historyIndex+1 > this.terminalHistory.length-1) historyIndex = 0;
                else historyIndex++;
                
                updateText();
            }else if(e.key == "ArrowLeft") {
                if(cursorPosition >= 0) cursorPosition--;
                updateText();
            }else if(e.key == "ArrowRight") {
                if(cursorPosition <= prevText.length) cursorPosition++;
                updateText();
            }else if(controlOn["Control"] && e.key == "c") {
                this.stopAllOperation = true;
            }else if(e.key == "Control") {
                controlOn[e.key] = true;
            }else if(e.key !== "Enter" && e.key !== "Shift") {
                cursorPosition++;
                prevText = this.insertAtIndex(`${prevText}`, `${e.key}`, cursorPosition-1);
                updateText();
            }
            
        }
        let keyup = (e) => {
            if(e.key == "Enter") checkCommand();
            else if(e.key == "Control") {
                controlOn[e.key] = false;
                this.stopAllOperation = false;
            }
        }
        let checkCommand = () => {
            window.removeEventListener("keydown", keydown);
            window.removeEventListener("keyup", keyup);
            let allCmds = document.querySelectorAll(".cmd")
            let cursor = allCmds[allCmds.length-1].querySelector(".cursor");
            cursor.classList.add("stop")
            this.terminalHistory.push({text:prevText, cursorPosition:cursorPosition});
            
            if(prevText == "/start") {
                this.ShowMessage("starting..")
                const Os = new OS();
                Os.Load();
            }else if(prevText == "/help") {
                this.ShowMessage("You can use the commands below for fun <br> /start - boot up the os <br> /help - info <br> /randomGen - random installation that doesn't actually install <br> /downloadAnimation - just an animation<br>")
                this.CommandLine();
            }else if(prevText == "/randomGen"){
                this.Random(3000, "This is it, all are random animals :D", () => {
                    this.CommandLine();
                })
            }else if(prevText == "/downloadAnimation"){
                this.ProgressBar(10, [100], "Animating", "done!", [], 0, () => {
                    this.CommandLine();
                })
            }else if(prevText == "/rdb"){
                let request = window.indexedDB.deleteDatabase("OSfolders")
                request.onsuccess = () => {
                    this.ShowMessage("successfully deleted the database (if you're not supposed to use this then you've forked up)")
                    this.CommandLine();
                }
            }else {
                this.ShowMessage("Error: Unknown command entered<br>");
                this.CommandLine();
            }
            return;
        }
        let commandInit = () => {
            window.addEventListener("keydown", keydown)
            window.addEventListener("keyup", keyup)
        }
        commandInit();
    }
    async InstallOS() {
        //init
        // this.ShowMessage("Initializing...");
        // await this.WaitFor(1000);
        // await this.ProgressBar(7,[300, 500, 200], "Processing User Data", "done processing", []);
        // await this.ProgressBar(10,[1000, 500, 700], "loading User Data", "preparing Cards XP");
        // await this.WaitFor(700);
        // this.Clear();
        // await this.WaitFor(700);
        // await this.ProgressBar(2,[2000, 1500], "Installing", "Adding Dependencies", ["unpacking cards xp folders", "designed by Kuro Daisuke"], 5);
        // await this.WaitFor(700);
        // await this.Random(2000, "finished Installing");
        // await this.WaitFor(700);
        // this.ShowMessage(`Loading The "OS"`, this.terminalDiv, false)
        // await this.LoadingAnimation(5000, 500);
        // this.ShowMessage("done!")
        // this.Break();
        this.ShowMessage("type /start to boot up the 'OS' <br>type /help for additional info<br>")
        this.CommandLine();
    }
    LoadingAnimation(time, timeperframe) {
        let animation = document.createElement("b");
        animation.classList.add("animation");
        this.terminalDiv.appendChild(animation)

        return new Promise((res) => {
            let currentFrame = 0;
            animation.innerHTML = "[/--]";
            let animate = () => {
                if(KeyPressed) res();
                currentFrame >= 2 ? currentFrame = 0 : currentFrame++;
                if(currentFrame == 0) {
                    animation.innerHTML = "[/--]";
                }else if(currentFrame == 1) {
                    animation.innerHTML = "[-\\-]";
                }else if(currentFrame == 2) {
                    animation.innerHTML = "[--/]";
                }
                console.log(currentFrame)
            }
            let interval = setInterval(animate, timeperframe);
            setTimeout(() => {
                clearInterval(interval); 
                res()
                animation.innerHTML = "<---!>";
                this.Break();
            }, time);
        })
    }
    Random(time, finishedMessage, func=()=>{}){
        return new Promise((res) => {
            let logs = document.createElement("div");
            logs.classList.add("logs");
            this.terminalDiv.appendChild(logs)

            let randomInit = () => {
                this.ShowMessage(`Installing : ${animals[Math.floor(Math.random()*animals.length)]} | verion - ${(Math.random() * 3.0).toFixed(2)}`, logs)
                this.ScrollToBottom();
                if(this.stopAllOperation) {
                    clearInterval(init);
                    this.Break();
                    this.ShowMessage(finishedMessage);
                    res();
                    func();
                }
            }
            let init = setInterval(randomInit, 10);
            setTimeout(() => {
                clearInterval(init);
                this.Break();
                this.ShowMessage(finishedMessage);
                res();
                func();
            }, time)
        })
    }
    ProgressBar(segments, timePerSegment, message, finishMessage="", Logs=[], additionalSize=0, func=()=>{}) {
        return new Promise((res) => {
            let loader = document.createElement("div");
            loader.classList.add("loader");
            loader.innerHTML = `
                ${message} [<b class="data"></b>] <br><br>
                <div class="logs"></div>
            `
            let data = loader.querySelector(".data")
            let logs = loader.querySelector(".logs")

            this.terminalDiv.appendChild(loader);
            this.ScrollToBottom();
            let current = 0;
            let currentLog = 0;

            let appendData = () => {
                if(Logs.length != 0 && currentLog <= Logs.length-1){
                    logs.innerHTML += `▄ ${Logs[currentLog]} <br>`;
                    currentLog++;
                }
                
                data.innerHTML = "";
                for(let i = 0; i < current; i++) for(let j = 0; j < this.segmentSize+additionalSize; j++) data.innerHTML += "▄";
                for(let i = 0; i < segments-current; i++) for(let j = 0; j < this.segmentSize+additionalSize; j++) data.innerHTML += ".";
            }
            appendData();

            let load = async () => {
                if(KeyPressed) res();
                if(current >= segments) {
                    res();
                    this.Break();
                    this.ShowMessage(finishMessage);
                    func();
                    return;
                }
                await this.WaitFor(timePerSegment[Math.floor(Math.random() * timePerSegment.length)]);
                current++;
                appendData();
                load();
            };
            load();
        })
    }
    WaitFor(seconds) {
        return new Promise((res) => {setTimeout(() => {res()}, seconds)})
    }
    ScrollToBottom() {
        this.terminalDiv.scrollTop = this.terminalDiv.scrollHeight;
    }
    ShowMessage(Message, div=this.terminalDiv, breakable=true){
        div.innerHTML += Message;
        if(breakable) div.innerHTML += "<br>";
        this.ScrollToBottom();
    }
    Break(div=this.terminalDiv){
        div.innerHTML += "<br>";
    }
    Clear() {
        this.terminalDiv.innerHTML = "";
    }
    Close() {
        this.terminalDiv.style.display = "none";
    }
}