import { DEFAULT_ACTIONS } from "./dependencies.js";

/**
 * @class
 * @example
 * const ActionLibrary = new ACTION_LIBRARY();
 * ... pass to the Terminal class
*/
export class ACTION_LIBRARY {
    #Actions = [...DEFAULT_ACTIONS];
    /**
     * 
     * @param {Array} update - TO_UPDATE
     * @example ActionLibrary.UpdateLibrary(
     *    ... Action formatted array
     * )
    */
    UpdateLibrary(update) {
        this.#Actions = [...DEFAULT_ACTIONS,...update];
    }
    get GetActions(){
        return this.#Actions
    }
}

/**
 * @global 
 * @name ActionFormat
 * @example
 * [
 *    {
 *      key: ""                           // <--- this is the command key
 *      parameterAllowed: true || false   // <-- Accepts parameter or not
 *      action: new Action                // <-- read Action tab for further info,
 *      description: ""                   // <--- description of the command
 *    }
 * ]
*/

export default ACTION_LIBRARY;