import IdentityAccessException from "../IdentityAccessException.js";

export default class IdentityAccessExceptionUnsupported extends IdentityAccessException {
    constructor(message, original = undefined) {
        super(message, original);
    }
}
