import { ApplicationServerServiceModule } from "@novemberizing/app";

import Storage from "@novemberizing/storage";

import IdentityAccessExceptionUninitialized from "../exception/Uninitialized.js";

const extension = {
    gen: {
        sql: "CALL PROCEDURE_USER_GEN(?)"
    },
    del: {
        sql: "CALL PROCEDURE_USER_DEL(?)"
    },
    get: {
        sql: "CALL PROCEDURE_USER_GET(?)"
    },
    set: {
        sql: "CALL PROCEDURE_USER_SET(?)"
    },
    reset: {
        sql: "CALL PROCEDURE_USER_RESET(?)"
    }
};

export default class IdentityAccessUser extends ApplicationServerServiceModule {
    #storage = null;

    constructor(service, config) {
        super("/user", service, config);

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
        if(this.#storage) {
            this.#storage.close();
        }
    }

    async gen(user) {
        return await this.#storage.query("gen", JSON.stringify(user));
    }

    async del(user) {
        return await this.#storage.query("del", JSON.stringify(user));
    }

    async get(user) {
        return await this.#storage.query("get", JSON.stringify(user));
    }

    async set(user) {
        return await this.#storage.query("set", JSON.stringify(user));
    }

    async reset(user) {
        return await this.#storage.query("reset", JSON.stringify(user));
    }
}
