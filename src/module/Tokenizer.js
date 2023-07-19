import JsonWebToken from "jsonwebtoken";

import { ApplicationServerServiceModule } from "@novemberizing/app";

const access = {
    secret: "identity.access.manager.tokenizer.access",
    options: {
        expiresIn: "10m"
    }
};

const refresh = {
    secret: "identity.access.manager.tokenizer.refresh",
    options: {
        expiresIn: "10d"
    }
};

export default class IdentityAccessTokenizer extends ApplicationServerServiceModule {
    constructor(service, config) {
        super("/token", service, config);

        config.access = config.access || access;
        config.refresh = config.refresh || refresh;
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
