import { ApplicationServerServiceModule } from "@novemberizing/app";

import Storage from "@novemberizing/storage";

import IdentityAccessExceptionUninitialized from "../exception/Uninitialized.js";

const extension = {
    gen: {
        sql: "CALL PROCEDURE_ACCOUNT_GEN(?)"
    },
    del: {
        sql: "CALL PROCEDURE_ACCOUNT_DEL(?)"
    },
    set: {
        sql: "CALL PROCEDURE_ACCOUNT_SET(?)"
    },
    get: {
        sql: "CALL PROCEDURE_ACCOUNT_GET(?)"
    }
};

export default class IdentityAccessAccount extends ApplicationServerServiceModule {
    #storage = null;

    constructor(service, config) {
        super("/account", service, config);

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

    async off() {
        await this.#storage.close();
    }

    async gen(account) {
        return await this.#storage.query("gen", JSON.stringify(account));
    }

    async del(account) {
        return await this.#storage.query("del", JSON.stringify(account));
    }

    async set(account) {
        return await this.#storage.query("set", JSON.stringify(account));
    }

    async get(account) {
        return await this.#storage.query("get", JSON.stringify(account));
    }
}
