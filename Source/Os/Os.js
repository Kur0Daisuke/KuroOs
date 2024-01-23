import Db from '../Database/main.js'

class Os{
    constructor() {
        this.db = new Db();

        this.#Initialize();
    }
    async #Initialize() {
        await this.db.Init();
        let data = await this.db.GetData("/This PC/Desktop/");

        data.forEach((e) => {
            document.querySelector(".folderSpace")
            .innerHTML += `
            <div class="folder">
                <ion-icon name="${e.icon}"></ion-icon>
                <p>${e.name}</p>
            </div>
            `
        })

        document.querySelector(".os").style.display = "block";
        
        console.log(data)
    }
}

export default Os;