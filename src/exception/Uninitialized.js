import IdentityAccessException from "../IdentityAccessException.js";

export default class IdentityAccessExceptionUninitialized extends IdentityAccessException {
    constructor(message, original = undefined) {
        super(message, original);
    }
}
