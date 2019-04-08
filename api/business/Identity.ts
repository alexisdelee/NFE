import {} from "./Credential";
import { AUser } from "./User";

export abstract class ACredential {
    public abstract store(password: string): string;
}

export class UserInfo {
    public userId: number;
    public authToken: string;
}

export class Identity<T extends AUser> {
    constructor() {
        // do something
    }
}
