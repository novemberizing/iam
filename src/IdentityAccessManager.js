import Application from "@novemberizing/app";
import _ from "lodash";

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

    /** 어디에 위치하는 것이 좋을까? */
    static #authorization(o, type, ...args) {
        if(type === 'http') {
            const req = args[0];

            const authorization = _.split(req.header("Authorization"), " ");
            if(authorization[0] === 'Google') {
                o.google = authorization[1];
            } else if(authorization[0] === 'Bearer') {
                o.access = authorization[1];
            }

            return o;
        }

        /** 현재는 지원하지 않는다. HTTP 말고 SOCKET 등도 구현할 예정이다. */
        throw new IdentityAccessExceptionUnsupported();
    }

    static #error(e) {
        console.log(e);
        return {
            name: e.name,
            message: e.message
        }
    }

    constructor(server, config) {
        super("/iam", server, config);

        if(!this.modules.get("/user")) this.reg(new IdentityAccessUser(this, {}));
        if(!this.modules.get("/account")) this.reg(new IdentityAccessAccount(this, {}));
        if(!this.modules.get("/authenticator")) this.reg(new IdentityAccessAuthenticator(this, {}));
        if(!this.modules.get("/authorizer")) this.reg(new IdentityAccessAuthorizer(this, {}));
        if(!this.modules.get("/token")) this.reg(new IdentityAccessTokenizer(this, {}));

        if(server.express) {
            server.express.get(`${this.path}/user/check`, async (req, res) => {
                /** 파라미터가 없는 것이 마음에 들지 않는다. */
                await IdentityAccessManager.call(async () => res.send(await this.check(IdentityAccessManager.#authorization({}, 'http', req))),
                                                       e  => res.status(500).send(IdentityAccessManager.#error(e)));
            });

            server.express.get(`${this.path}/signin`, async (req, res) => {
                const o = {
                    account: {
                        identity: req.query.identity,
                        password: req.query.password
                    }
                };
                await IdentityAccessManager.call(async () => res.send(await this.signin(IdentityAccessManager.#authorization(o, 'http', req))),
                                                       e  => res.status(500).send(IdentityAccessManager.#error(e)));
            });

            server.express.post(`${this.path}/signup`, async (req, res) => {
                await IdentityAccessManager.call(async () => res.send(await this.signup(req.body.account, req.body.user)),
                                                       e  => res.status(500).send(IdentityAccessManager.#error(e)));
            });
        }
    }

    async check(o) {
        if(o.access) {
            return await this.moduleCall("/token", "access", o.access);
        }

        if(o.google) {
            const ticket = await this.moduleCall("/authenticator", "authenticate", { google: { credential: o.google }});
            let user = await this.moduleCall("/user", "get", { email: ticket.payload.email });

            if(user === undefined) {
                // 사용자가 존재하지 않으면 사용자를 생성한다.
                user = await this.moduleCall("/user", "gen", {
                    email: ticket.payload.email,
                    name: `${ticket.payload.given_name} ${ticket.payload.family_name}`,
                    profile: ticket.payload.picture
                });
            }

            const token = await this.moduleCall("/token", "gen", { user }, { google: { credential: o.google }});

            return { user, token };
        }

        throw new IdentityAccessExceptionUnsupported();
    }

    // account, token, google
    async signin(o) {
        if(o.access) {
            return await this.moduleCall("/token", "access", o.access);
        }

        if(o.google) {
            const ticket = await this.moduleCall("/authenticator", "authenticate", { google: { credential: o.google }});
            let user = await this.moduleCall("/user", "get", { email: ticket.payload.email });

            if(user === undefined) {
                // 사용자가 존재하지 않으면 사용자를 생성한다.
                user = await this.moduleCall("/user", "gen", {
                    email: ticket.payload.email,
                    name: `${ticket.payload.given_name} ${ticket.payload.family_name}`,
                    profile: ticket.payload.picture
                });
            }

            const token = await this.moduleCall("/token", "gen", { user }, { google: { credential: o.google }});

            return { user, token };
        }

        if(o.account) {
            const account = await this.moduleCall("/account", "get", o.account);
            const user = await this.moduleCall("/user", "get", { no: account.no });

            const token = await this.moduleCall("/token", "gen", { user }, { account });

            return { user, token };
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
        const token = await this.moduleCall("/token", "gen", { user }, { account });

        return { account, user, token };
    }
}
