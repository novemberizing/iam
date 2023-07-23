import { ApplicationServerServiceModule } from "@novemberizing/app";
import { OAuth2Client } from 'google-auth-library';

import IdentityAccessExceptionUnsupported from "../exception/Unsupported.js";

export default class IdentityAccessAuthenticator extends ApplicationServerServiceModule {
    #google = null;
    constructor(service, config) {
        super("/authenticator", service, config);

        if(config.google) {
            this.#google = new OAuth2Client();
        }
    }

    async authenticate(o) {
        if(o.access) {
            return await this.service.moduleCall("/token", "access", o.access);
        }

        if(o.google) {
            if(this.#google) {
                if(o.google.credential) {
                    return await this.#google.verifyIdToken({
                        idToken: o.google.credential,
                        audience: this.config.google.id
                    });
                }
                throw new IdentityAccessExceptionUnsupported();
            }
            throw new IdentityAccessExceptionUnsupported();
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
