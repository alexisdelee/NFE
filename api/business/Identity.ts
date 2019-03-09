import { AUser, Agent } from "./User";

export class IdentityInfo {
    public userId: number;
    public authToken: string;
}

export class Identity<T extends AUser> {
    constructor() {
        // do something
    }
}
