import { Query } from "./Query";
import { Resource } from "./Resource";
import { Role } from "./Role";

export class User extends Query {
    public pseudo: string;
    public nfeid: string;
    public password: string;
    public salt: string;
    public iterations: number;
    public avatar: Resource;
    public role: Role;
}
