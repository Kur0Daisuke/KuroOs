import { DEFAULT_ACTIONS } from "./dependencies.js";

export class ACTION_LIBRARY {
    #Actions = [...DEFAULT_ACTIONS];
    UpdateLibrary(update) {
        this.#Actions = [...DEFAULT_ACTIONS,...update];
    }
    get GetActions(){
        return this.#Actions
    }
}

export default ACTION_LIBRARY;