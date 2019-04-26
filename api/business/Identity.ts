import { PasswordCredential, TokenCredential } from "./Credential";
import { AUserBusiness } from "./UserBusiness";

export class Identity<T extends AUserBusiness> {
    constructor(public readonly user: T) {
        // do something
    }
}
