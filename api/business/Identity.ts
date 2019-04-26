import { PasswordCredential, TokenCredential } from "./Credential";
import { AUser } from "./User";

export class Identity<T extends AUser> {
    constructor(public readonly user: T) {
        // do something
    }
}
