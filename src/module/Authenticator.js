import { ApplicationServerServiceModule } from "@novemberizing/app";

import IdentityAccessExceptionUnsupported from "../exception/Unsupported.js";

export default class IdentityAccessAuthenticator extends ApplicationServerServiceModule {
    constructor(service, config) {
        super("/authenticator", service, config);
    }

    async authenticate(o) {
        if(o.access) {
            return await this.service.moduleCall("/token", "access", o.access);
        }

        if(o.identity && o.password) {
            return await this.service.moduleCall("/account", "get", { identity: o.identity, password: o.password });
        }

        if(o.refresh) {
            return await this.service.moduleCall("/token", "refresh", o.refresh);
        }

        throw new IdentityAccessExceptionUnsupported();
    }
}
