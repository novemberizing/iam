import { ApplicationServerServiceModule } from "@novemberizing/app";

export default class IdentityAccessAuthorizer extends ApplicationServerServiceModule {
    constructor(service, config) {
        super("/authorizer", service, config);
    }
}