import Application from "@novemberizing/app";

import { ApplicationServerService } from "@novemberizing/app";

import IdentityAccessAccount from "./module/Account.js";
import IdentityAccessAuthenticator from "./module/Authenticator.js";
import IdentityAccessAuthorizer from "./module/Authorizer.js";
import IdentityAccessTokenizer from "./module/Tokenizer.js";
import IdentityAccessUser from "./module/User.js";

import IdentityAccessExceptionInvalid from "./exception/Invalid.js";
import IdentityAccessExceptionUnsupported from "./exception/Unsupported.js";

export default class IdentityAccessManager extends ApplicationServerService {
    static {
        Application.use(IdentityAccessAccount);
        Application.use(IdentityAccessAuthenticator);
        Application.use(IdentityAccessAuthorizer);
        Application.use(IdentityAccessTokenizer);
        Application.use(IdentityAccessUser);
    }

    constructor(server, config) {
        super("/iam", server, config);

        if(server.express) {
        }
    }

    // account, token
    async signin(o) {
        if(o.token && o.token.access) {
            return await this.moduleCall("/token", "access", o.token.access);
        }

        if(o.account) {
            const account = await this.moduleCall("/account", "get", o.account);
            const user = await this.moduleCall("/user", "get", { no: account.no });
            return { account, user };
        }

        throw new IdentityAccessExceptionUnsupported();
    }

    async signup(account, user) {
        user = await this.moduleCall("/user", "gen", user);
        account = await this.moduleCall("/account", "gen", Object.assign({ no: user.no }, account));

        return { account, user };
    }
}
