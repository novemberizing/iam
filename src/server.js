import Application from "@novemberizing/app";
import IdentityAccessManager from "./IdentityAccessManager.js";
import Config from "@novemberizing/config";
import Log from "@novemberizing/log";

// Log.config = {
//     error: false,
//     warning: false,
//     information: false,
//     debug: false,
//     verbose: false
// };

Application.use(IdentityAccessManager);

await Application.on(await Config.gen({ url: "fs://./configure.json" }));
