import { Query } from "./Query";
import { User } from "./User";

export class Preference extends Query {
    public user: User;
    public key: string;
    public value: string;
}
