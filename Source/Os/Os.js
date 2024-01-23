import Db from '../Database/main.js'

class Os{
    constructor() {
        this.db = new Db();

        this.#Initialize();
    }
    async #Initialize() {
        await this.db.Init();
        let data = await this.db.GetData("/This PC/Desktop");

        document.querySelector(".os").style.display = "block";
        
        console.log(data)
    }
}

export default Os;