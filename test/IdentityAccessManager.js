import assert from "assert";

import IdentityAccessManager from "../src/IdentityAccessManager.js";

import Application from "@novemberizing/app";
import Config from "@novemberizing/config";
import Log from "@novemberizing/log";
import _ from "lodash";
import axios from "axios";

Log.config = {
    error: false,
    warning: false,
    information: false,
    debug: false,
    verbose: false
};

describe("IdentityAccessManager", () => {
    it(" 0001 IdentityAccessManager IdentityAccessUser", async () => {
        Application.use(IdentityAccessManager);

        await Application.on(await Config.gen({ url: "fs://./test/IdentityAccessManager.configure.json" }));

        let user = await Application.administrator.moduleCall("/iam", "/user", "get", { email: "novemberizing@gmail.com" });

        if(!user) {
            user = await Application.administrator.moduleCall("/iam", "/user", "gen", { email: "novemberizing@gmail.com" });
        }

        user.gender = "m";
        user.birthday = "1977/11/03";
        user.name = "novemberizing";
        user = await Application.administrator.moduleCall("/iam", "/user", "set", user);

        user = { email: "iticworld@gmail.com" };
        user = await Application.administrator.moduleCall("/iam", "/user", "gen", user);
        user.email = "iticworld@daum.net";
        user = await Application.administrator.moduleCall("/iam", "/user", "reset", user);
        user = await Application.administrator.moduleCall("/iam", "/user", "del", user);


        await Application.off();
    });

    it(" 0002 IdentityAccessManager IdentityAccessAccount", async () => {
        Application.use(IdentityAccessManager);

        await Application.on(await Config.gen({ url: "fs://./test/IdentityAccessManager.configure.json" }));

        const user = await Application.administrator.moduleCall("/iam", "/user", "get", { email: "novemberizing@gmail.com" });

        let account = {
            no: user.no
        };

        account = await Application.administrator.moduleCall("/iam", "/account", "get", account);

        if(!account) {
            account = {
                no: user.no,
                identity: "administrator",
                password: "melong@172"
            };
            account = await Application.administrator.moduleCall("/iam", "/account", "gen", account);
        }

        account.password = "melong@17";
        account = await Application.administrator.moduleCall("/iam", "/account", "set", account);

        delete account.no;
        account.password = "melong@17";
        account = await Application.administrator.moduleCall("/iam", "/account", "get", account);

        await Application.administrator.moduleCall("/iam", "/account", "del", account);

        account = {
            no: user.no,
            identity: "administrator",
            password: "melong@17"
        };
        account = await Application.administrator.moduleCall("/iam", "/account", "gen", account);
        
        await Application.off();
    });

    it(" 0003 IdentityAccessManager IdentityAccessTokenizer", async () => {
        Application.use(IdentityAccessManager);

        await Application.on(await Config.gen({ url: "fs://./test/IdentityAccessManager.configure.json" }));

        const account = await Application.administrator.moduleCall("/iam", "/account", "get", { identity: "administrator", password: "melong@17" });
        const user = await Application.administrator.moduleCall("/iam", "/user", "get", { no: account.no });
        const token = await Application.administrator.moduleCall("/iam", "/token", "gen", { user, account }, account);

        const access = await Application.administrator.moduleCall("/iam", "/token", "access", token.access);
        const refresh = await Application.administrator.moduleCall("/iam", "/token", "refresh", token.refresh);
        
        await Application.off();
    });

    it(" 0004 IdentityAccessManager IdentityAccessAuthenticator", async () => {
        Application.use(IdentityAccessManager);

        await Application.on(await Config.gen({ url: "fs://./test/IdentityAccessManager.configure.json" }));

        const account = await Application.administrator.moduleCall("/iam", "/account", "get", { identity: "administrator", password: "melong@17" });
        const user = await Application.administrator.moduleCall("/iam", "/user", "get", { no: account.no });
        const token = await Application.administrator.moduleCall("/iam", "/token", "gen", { user, account }, account);

        let o = {
            identity: "administrator",
            password: "melong@17"
        };
        await Application.administrator.moduleCall("/iam", "/authenticator", "authenticate", o);

        o = {
            identity: "administrator2",
            password: "melong@17"
        };
        await Application.administrator.moduleCall("/iam", "/authenticator", "authenticate", o);

        o = {
            access: token.access
        };

        await Application.administrator.moduleCall("/iam", "/authenticator", "authenticate", o);

        await assert.rejects(async () => {
            o = {
                access: token.access + '1234'
            };
    
            await Application.administrator.moduleCall("/iam", "/authenticator", "authenticate", o);
        });

        await assert.rejects(async () => {
            o = {
                refresh: token.refresh + '1234'
            };

            await Application.administrator.moduleCall("/iam", "/authenticator", "authenticate", o);
        });

        await Application.off();
    });

    it(" 0005 IdentityAccessManager", async () => {
        Application.use(IdentityAccessManager);

        await Application.on(await Config.gen({ url: "fs://./test/IdentityAccessManager.configure.json" }));

        const account = await Application.administrator.moduleCall("/iam", "/account", "get", { identity: "administrator", password: "melong@17" });
        const user = await Application.administrator.moduleCall("/iam", "/user", "get", { no: account.no });
        const token = await Application.administrator.moduleCall("/iam", "/token", "gen", { user, account }, account);

        let o = {
            token
        };

        await Application.administrator.call("/iam", "signin", o);

        o = {
            account
        };

        await Application.administrator.call("/iam", "signin", o);

        try {
            await Application.administrator.moduleCall("/iam", "/user", "del", { email: "novemberizing@outlook.kr" });
        } catch(e) {

        }
        
        await Application.administrator.moduleCall("/iam", "/account", "del", { identity: "novemberizing", password: "melong@17" });

        await Application.administrator.call("/iam", "signup", { identity: "novemberizing", password: "melong@17" }, { email: "novemberizing@outlook.kr" });

        await Application.off();
    });

    it(" 0006 IdentityAccessManager", async () => {
        Application.use(IdentityAccessManager);

        await Application.on(await Config.gen({ url: "fs://./test/IdentityAccessManager.configure.json" }));

        await assert.rejects(axios.get(`http://localhost:40001/iam/signin?identity=hello&password=world`));

        try {
            Application.server.moduleCall("/iam", "/account", "del", { identity: "iticworld", password: "melong@17" });
        } catch(e) {

        }

        try {
            Application.server.moduleCall("/iam", "/user", "del", { email: "iticworld@daum.com" });
        } catch(e) {

        }

        await axios.post('http://localhost:40001/iam/signup', {
            account: {
                identity: "iticworld",
                password: "melong@17"
            },
            user: {
                email: "iticworld@daum.com",
                name: "Hyunsik Park",
                gender: "m",
                birthday: "1977/11/03"
            }
        });

        await axios.get(`http://localhost:40001/iam/signin?identity=iticworld&password=melong@17`);

        await Application.off();
    });
});
