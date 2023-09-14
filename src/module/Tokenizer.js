import JsonWebToken from "jsonwebtoken";

import Storage from "@novemberizing/storage";

import { ApplicationServerServiceModule } from "@novemberizing/app";

import IdentityAccessExceptionUninitialized from "../exception/Uninitialized.js";

const secret = "identity.access.manager.tokenizer";

const access = {
    secret: "identity.access.manager.tokenizer.access",
    options: {
        expiresIn: "1d"
    }
};

const refresh = {
    secret: "identity.access.manager.tokenizer.refresh",
    options: {
        expiresIn: "10d"
    }
};

const extension = {
    gen: {
        sql: "CALL PROCEDURE_TOKEN_GEN(?, ?, ?, ?)"
    }
};

export default class IdentityAccessTokenizer extends ApplicationServerServiceModule {
    #storage = null;

    constructor(service, config) {
        super("/token", service, config);

        config.secret = config.secret || secret;
        config.access = config.access || access;
        config.refresh = config.refresh || refresh;

        if(config.storage) {
            this.#storage = new Storage(Object.assign({extension}, config.storage));
        } else if(service.config.storage) {
            this.#storage = new Storage(Object.assign({extension}, service.config.storage));
        } else if(service.server.config.storage) {
            this.#storage = new Storage(Object.assign({extension}, service.server.config.storage));
        } else {
            throw new IdentityAccessExceptionUninitialized();
        }
    }

    async sign(payload, secret, options) {
        return JsonWebToken.sign(payload, secret, options);
    }

    async verify(token, secret, options) {
        return JsonWebToken.verify(token, secret, options);
    }

    async gen(no, email, ip, extension) {
        const timestamp = Date.now();

        const token = await this.sign({email, timestamp}, this.config.secret);

        await this.#storage.query("gen", no, token, ip, extension);

        return token;
    }

    async check(token) {
        return await this.verify(token, this.config.secret);
    }

    async off() {
        await this.#storage.close();
    }
}
