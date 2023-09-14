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

        console.log(user);
        
        const token = await Application.administrator.moduleCall("/iam", "/token", "gen", account.no, user.email, "192.168.0.1");

        console.log(token);

        const check = await Application.administrator.moduleCall("/iam", "/token", "check", token);

        console.log(check);
        
        await Application.off();
    });
});
