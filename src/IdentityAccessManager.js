import Application from "@novemberizing/app";

import { ApplicationServerService } from "@novemberizing/app";

import IdentityAccessAccount from "./module/Account.js";
import IdentityAccessAuthenticator from "./module/Authenticator.js";
import IdentityAccessAuthorizer from "./module/Authorizer.js";
import IdentityAccessTokenizer from "./module/Tokenizer.js";
import IdentityAccessUser from "./module/User.js";

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

        if(!this.modules.get("/user")) this.reg(new IdentityAccessUser(this, {}));
        if(!this.modules.get("/account")) this.reg(new IdentityAccessAccount(this, {}));
        if(!this.modules.get("/authenticator")) this.reg(new IdentityAccessAuthenticator(this, {}));
        if(!this.modules.get("/authorizer")) this.reg(new IdentityAccessAuthorizer(this, {}));
        if(!this.modules.get("/token")) this.reg(new IdentityAccessTokenizer(this, {}));

        if(server.express) {
            server.express.get(`${this.path}/signin`, async (req, res) => {
                try {
                    res.send(await this.signin({ account: { identity: req.query.identity, password: req.query.password }}));
                } catch(e) {
                    res.status(500).send({});
                }
            });
            server.express.post(`${this.path}/signup`, async (req, res) => {
                try {
                    res.send(await this.signup(req.body.account, req.body.user));
                } catch(e) {
                    console.log(e);
                    res.status(500).send({});
                }
            });
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

    /**
     * 모듈의 호출 순서는 중요하다.
     * 
     * 사용자 생성에 실패하면 계정을 생성하지 말아야 한다.
     * 
     * @param {Object} account      계정 정보
     * @param {Object} user         사용자 정보
     * @return  Object              사용자 정보와 계정 정보를 리턴한다.
     */
    async signup(account, user) {
        user = await this.moduleCall("/user", "gen", user);
        account = await this.moduleCall("/account", "gen", Object.assign({ no: user.no }, account));

        return { account, user };
    }
}
