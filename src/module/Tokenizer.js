import JsonWebToken from "jsonwebtoken";

import { ApplicationServerServiceModule } from "@novemberizing/app";

export default class IdentityAccessTokenizer extends ApplicationServerServiceModule {
    constructor(service, config) {
        super("/token", service, config);
    }

    async sign(payload, secret, options) {
        return JsonWebToken.sign(payload, secret, options);
    }

    async verify(token, secret, options) {
        return JsonWebToken.verify(token, secret, options);
    }

    async gen(access, refresh) {
        access = await this.sign(access, this.config["access"].secret, this.config["access"].options);
        refresh = await this.sign(refresh, this.config["refresh"].secret, this.config["refresh"].options);

        return { access, refresh };
    }

    async access(token) {
        return await this.verify(token, this.config["access"].secret, this.config["access"].options);
    }

    async refresh(token) {
        return await this.verify(token, this.config["refresh"].secret, this.config["refresh"].options);
    }
}
