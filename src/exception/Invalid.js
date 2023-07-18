import IdentityAccessException from "../IdentityAccessException.js";

export default class IdentityAccessExceptionInvalid extends IdentityAccessException {
    constructor(message, original = undefined) {
        super(message, original);
    }
}
