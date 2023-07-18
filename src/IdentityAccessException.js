import Log from "@novemberizing/log";

export default class IdentityAccessException extends Error {
    static #tag = "IdentityAccessException";

    #original = null;

    get original(){ return this.#original; }

    constructor(message, original = undefined) {
        super(message);

        this.#original = original;

        if(this.#original) {
            Log.w(IdentityAccessException.#tag, original);
        }
    }
}